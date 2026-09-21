const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const cron = require('node-cron');
const webpush = require('web-push');
const { google } = require('googleapis');
const dns = require('dns');

require('dotenv').config();

dns.setDefaultResultOrder('ipv4first');

// ============================================================
// MODELS
// ============================================================

const User = require('./usermodel');
const Notification = require('./notificationModel');
const Subscription = require('./subscriptionModel');

// ============================================================
// ROUTERS
// ============================================================

const authRouter = require('./authroutes');
const activityRouter = require('./activityroutes');
const bmiRouter = require('./bmiroutes');
const notificationRouter = require('./notifications');
const pushRouter = require('./pushRoutes');
const dietplanRouter = require('./dietplanRoutes');

// ============================================================
// EXPRESS
// ============================================================

const app = express();

app.use(cors());
app.use(express.json({ limit: '2mb' }));

// ============================================================
// INDIA DATE HELPER
// ============================================================

function getIndiaDateString(date = new Date()) {
    return new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Asia/Kolkata',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    }).format(date);
}

function getIndiaStartOfDay() {
    const dateString = getIndiaDateString();

    return new Date(
        `${dateString}T00:00:00+05:30`
    );
}

// ============================================================
// WEB PUSH / VAPID
// ============================================================

if (
    process.env.VAPID_PUBLIC_KEY &&
    process.env.VAPID_PRIVATE_KEY
) {
    webpush.setVapidDetails(
        process.env.VAPID_MAILTO ||
        process.env.VAPID_EMAIL ||
        'mailto:support@healthapp.com',
        process.env.VAPID_PUBLIC_KEY,
        process.env.VAPID_PRIVATE_KEY
    );

    console.log('>>> Web Push VAPID configuration loaded');
} else {
    console.warn(
        'WARNING: VAPID keys are missing. Web push notifications may fail.'
    );
}

// ============================================================
// GMAIL API
// ============================================================

const OAuth2 = google.auth.OAuth2;

const oauth2Client = new OAuth2(
    process.env.GMAIL_CLIENT_ID,
    process.env.GMAIL_CLIENT_SECRET,
    'https://developers.google.com/oauthplayground'
);

if (process.env.GMAIL_REFRESH_TOKEN) {
    oauth2Client.setCredentials({
        refresh_token: process.env.GMAIL_REFRESH_TOKEN
    });
}

// ============================================================
// SEND EMAIL
// ============================================================

async function sendEmailViaGmailAPI(toEmail, otp) {
    const gmail = google.gmail({
        version: 'v1',
        auth: oauth2Client
    });

    const subject = 'Your Health App Login OTP';

    const utf8Subject =
        `=?utf-8?B?${Buffer.from(subject).toString('base64')}?=`;

    const messageParts = [
        `From: Health App <${process.env.EMAIL_USER}>`,
        `To: ${toEmail}`,
        `Subject: ${utf8Subject}`,
        'Content-Type: text/html; charset=utf-8',
        'MIME-Version: 1.0',
        '',
        `<div style="font-family:Arial,sans-serif;padding:20px;color:#333">
            <h2>Health App Authentication</h2>
            <p>Your OTP code for login is:</p>
            <strong style="font-size:28px;color:#007bff">
                ${otp}
            </strong>
            <p>This code is valid for <strong>10 minutes</strong>.</p>
        </div>`
    ];

    const message = messageParts.join('\n');

    const encodedMessage = Buffer.from(message)
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');

    await gmail.users.messages.send({
        userId: 'me',
        requestBody: {
            raw: encodedMessage
        }
    });
}

// ============================================================
// SEND PUSH TO USER
// ============================================================

async function sendPushToUser(userId, notification) {
    try {
        const subscriptions = await Subscription.find({
            userId: userId
        });

        const payload = JSON.stringify({
            title:
                notification.title ||
                'Health App Reminder',

            body:
                notification.message ||
                'You have a health reminder.',

            id:
                notification._id
                    ? notification._id.toString()
                    : undefined,

            _id:
                notification._id
                    ? notification._id.toString()
                    : undefined,

            category:
                notification.category ||
                'General',

            isInteractive:
                notification.isInteractive !== false
        });

        for (const sub of subscriptions) {
            try {
                await webpush.sendNotification(
                    {
                        endpoint: sub.endpoint,
                        keys: sub.keys
                    },
                    payload
                );
            } catch (err) {
                console.error(
                    'Push notification error:',
                    err.message
                );

                if (
                    err.statusCode === 404 ||
                    err.statusCode === 410
                ) {
                    await Subscription.deleteOne({
                        endpoint: sub.endpoint
                    });
                }
            }
        }
    } catch (err) {
        console.error(
            'sendPushToUser error:',
            err.message
        );
    }
}

// ============================================================
// CREATE DAILY NOTIFICATION
// ============================================================

async function createDailyNotification({
    user,
    title,
    message,
    category,
    uniqueKey
}) {
    try {
        const startOfDay = getIndiaStartOfDay();

        const query = {
            userId: user._id,
            category: category,
            createdAt: {
                $gte: startOfDay
            }
        };

        if (uniqueKey) {
            query.title = uniqueKey;
        } else {
            query.title = title;
        }

        const existing =
            await Notification.findOne(query);

        if (existing) {
            return existing;
        }

        const notification =
            await Notification.create({
                userId: user._id,
                category,
                title,
                message,
                isInteractive: true,
                status: 'Unread'
            });

        await sendPushToUser(
            user._id,
            notification
        );

        return notification;

    } catch (err) {
        console.error(
            'createDailyNotification error:',
            err.message
        );

        return null;
    }
}

// ============================================================
// BASE ROUTES
// ============================================================

app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Health App Server is active and running!'
    });
});

app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        status: 'OK',
        date: getIndiaDateString()
    });
});

// ============================================================
// SEND OTP
// ============================================================

app.post('/api/auth/send-otp', async (req, res) => {
    try {
        let { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email is required'
            });
        }

        email = email.toLowerCase().trim();

        const otp =
            Math.floor(
                100000 +
                Math.random() * 900000
            ).toString();

        const otpExpiry =
            new Date(
                Date.now() +
                10 * 60 * 1000
            );

        let user =
            await User.findOne({ email });

        if (!user) {
            user = new User({
                email,
                otp,
                otpExpiry
            });
        } else {
            user.otp = otp;
            user.otpExpiry = otpExpiry;
        }

        await user.save();

        console.log(
            `>>> OTP FOR ${email}: ${otp}`
        );

        await sendEmailViaGmailAPI(
            email,
            otp
        );

        console.log(
            `>>> OTP Email delivered to ${email}`
        );

        return res.status(200).json({
            success: true,
            message: 'OTP sent successfully.'
        });

    } catch (err) {
        console.error(
            'SEND-OTP FAILED:',
            err.message
        );

        return res.status(500).json({
            success: false,
            message:
                `Email sending failed: ${err.message}`
        });
    }
});

// ============================================================
// VERIFY OTP
// ============================================================

app.post('/api/auth/verify-otp', async (req, res) => {
    try {
        let { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({
                success: false,
                message:
                    'Email and OTP are required'
            });
        }

        email = email.toLowerCase().trim();

        const user =
            await User.findOne({ email });

        if (
            !user ||
            user.otp !== String(otp) ||
            !user.otpExpiry ||
            user.otpExpiry < new Date()
        ) {
            return res.status(400).json({
                success: false,
                message:
                    'Invalid or expired OTP'
            });
        }

        user.otp = null;
        user.otpExpiry = null;

        await user.save();

        const jwtSecret =
            process.env.JWT_SECRET;

        if (!jwtSecret) {
            return res.status(500).json({
                success: false,
                message:
                    'JWT_SECRET is missing'
            });
        }

        const token =
            jwt.sign(
                {
                    id: user._id,
                    email: user.email
                },
                jwtSecret,
                {
                    expiresIn: '7d'
                }
            );

        return res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            email: user.email,
            user: {
                id: user._id,
                email: user.email
            }
        });

    } catch (err) {
        console.error(
            'VERIFY OTP ERROR:',
            err
        );

        return res.status(500).json({
            success: false,
            message:
                'Server error during verification.'
        });
    }
});

// ============================================================
// FEATURE ROUTERS
// ============================================================

app.use(
    '/api/auth',
    authRouter
);

app.use(
    '/api/activities',
    activityRouter
);

app.use(
    '/api/bmi',
    bmiRouter
);

app.use(
    '/api/notifications',
    notificationRouter
);

app.use(
    '/api/push',
    pushRouter
);

app.use(
    '/api/diet-plan',
    dietplanRouter
);

// ============================================================
// SNOOZED NOTIFICATIONS
// RUN EVERY MINUTE
// ============================================================

cron.schedule(
    '* * * * *',
    async () => {
        try {
            const now = new Date();

            const dueNotifications =
                await Notification.find({
                    status: 'Snoozed',
                    snoozedUntil: {
                        $lte: now
                    }
                });

            for (
                const notification
                of dueNotifications
            ) {
                await sendPushToUser(
                    notification.userId,
                    notification
                );

                notification.status =
                    'Unread';

                notification.snoozedUntil =
                    null;

                await notification.save();
            }

        } catch (err) {
            console.error(
                'Snooze processor error:',
                err.message
            );
        }
    },
    {
        timezone: 'Asia/Kolkata'
    }
);

// ============================================================
// BREAKFAST REMINDER
// 8:30 AM
// ============================================================

cron.schedule(
    '30 8 * * *',
    async () => {
        try {
            console.log(
                '>>> Breakfast reminder started'
            );

            const users =
                await User.find({});

            for (const user of users) {
                await createDailyNotification({
                    user,
                    title: 'Breakfast Time',
                    message:
                        'Good morning! It is time for your breakfast.',
                    category: 'Food',
                    uniqueKey: 'Breakfast Time'
                });
            }

        } catch (err) {
            console.error(
                'Breakfast scheduler error:',
                err.message
            );
        }
    },
    {
        timezone: 'Asia/Kolkata'
    }
);

// ============================================================
// WATER REMINDERS
// 9:30 AM
// 11:30 AM
// 3:30 PM
// 5:30 PM
// 7:30 PM
// ============================================================

const waterReminderTimes = [
    {
        cron: '30 9 * * *',
        title: 'Water Reminder 9:30 AM'
    },
    {
        cron: '30 11 * * *',
        title: 'Water Reminder 11:30 AM'
    },
    {
        cron: '30 15 * * *',
        title: 'Water Reminder 3:30 PM'
    },
    {
        cron: '30 17 * * *',
        title: 'Water Reminder 5:30 PM'
    },
    {
        cron: '30 19 * * *',
        title: 'Water Reminder 7:30 PM'
    }
];

for (
    const waterReminder
    of waterReminderTimes
) {
    cron.schedule(
        waterReminder.cron,
        async () => {
            try {
                console.log(
                    `>>> ${waterReminder.title} started`
                );

                const users =
                    await User.find({});

                for (
                    const user
                    of users
                ) {
                    await createDailyNotification({
                        user,
                        title:
                            waterReminder.title,
                        message:
                            'Time to drink water. Tap the notification and record your water intake.',
                        category: 'Water',
                        uniqueKey:
                            waterReminder.title
                    });
                }

            } catch (err) {
                console.error(
                    'Water scheduler error:',
                    err.message
                );
            }
        },
        {
            timezone: 'Asia/Kolkata'
        }
    );
}

// ============================================================
// LUNCH REMINDER
// 1:00 PM
// ============================================================

cron.schedule(
    '0 13 * * *',
    async () => {
        try {
            console.log(
                '>>> Lunch reminder started'
            );

            const users =
                await User.find({});

            for (const user of users) {
                await createDailyNotification({
                    user,
                    title: 'Lunch Time',
                    message:
                        'It is lunch time. Remember to record your meal.',
                    category: 'Food',
                    uniqueKey: 'Lunch Time'
                });
            }

        } catch (err) {
            console.error(
                'Lunch scheduler error:',
                err.message
            );
        }
    },
    {
        timezone: 'Asia/Kolkata'
    }
);

// ============================================================
// DINNER REMINDER
// 8:30 PM
// ============================================================

cron.schedule(
    '30 20 * * *',
    async () => {
        try {
            console.log(
                '>>> Dinner reminder started'
            );

            const users =
                await User.find({});

            for (const user of users) {
                await createDailyNotification({
                    user,
                    title: 'Dinner Time',
                    message:
                        'It is dinner time. Remember to record your meal.',
                    category: 'Food',
                    uniqueKey: 'Dinner Time'
                });
            }

        } catch (err) {
            console.error(
                'Dinner scheduler error:',
                err.message
            );
        }
    },
    {
        timezone: 'Asia/Kolkata'
    }
);

// ============================================================
// SLEEP REMINDER
// 10:15 PM
// ============================================================

cron.schedule(
    '15 22 * * *',
    async () => {
        try {
            console.log(
                '>>> Sleep reminder started'
            );

            const users =
                await User.find({});

            for (const user of users) {
                await createDailyNotification({
                    user,
                    title: 'Sleep Time',
                    message:
                        'It is 10:15 PM. Are you going to sleep?',
                    category: 'Reminders',
                    uniqueKey: 'Sleep Time'
                });
            }

        } catch (err) {
            console.error(
                'Sleep scheduler error:',
                err.message
            );
        }
    },
    {
        timezone: 'Asia/Kolkata'
    }
);

// ============================================================
// WAKE-UP REMINDER
// 6:45 AM
// ============================================================

cron.schedule(
    '45 6 * * *',
    async () => {
        try {
            console.log(
                '>>> Wake-up reminder started'
            );

            const users =
                await User.find({});

            for (const user of users) {
                await createDailyNotification({
                    user,
                    title: 'Good Morning',
                    message:
                        'Good morning! Are you awake?',
                    category: 'Reminders',
                    uniqueKey: 'Good Morning'
                });
            }

        } catch (err) {
            console.error(
                'Wake-up scheduler error:',
                err.message
            );
        }
    },
    {
        timezone: 'Asia/Kolkata'
    }
);

// ============================================================
// MONGODB + SERVER
// ============================================================

const MONGO_URI =
    process.env.MONGO_URI ||
    process.env.MONGODB_URI;

const PORT =
    process.env.PORT || 5000;

if (!MONGO_URI) {
    console.error(
        'CRITICAL ERROR: MONGO_URI is missing!'
    );
    process.exit(1);
}

mongoose
    .connect(MONGO_URI)
    .then(() => {
        console.log(
            '>>> MongoDB Connected Successfully'
        );

        app.listen(
            PORT,
            () => {
                console.log(
                    `>>> Server is live and listening on port ${PORT}`
                );

                console.log(
                    `>>> India Date: ${getIndiaDateString()}`
                );

                console.log(
                    '>>> Food reminders: ENABLED'
                );

                console.log(
                    '>>> Water reminders: ENABLED'
                );

                console.log(
                    '>>> Sleep reminder: ENABLED'
                );

                console.log(
                    '>>> Wake-up reminder: ENABLED'
                );
            }
        );
    })
    .catch((err) => {
        console.error(
            '>>> MongoDB Connection Error:',
            err.message
        );

        process.exit(1);
    });
