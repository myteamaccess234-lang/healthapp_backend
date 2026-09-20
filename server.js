const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const cron = require('node-cron');
const webpush = require('web-push');
const { google } = require('googleapis');
const dns = require('dns');

require('dotenv').config();

// ============================================================
// DNS CONFIGURATION
// ============================================================

dns.setDefaultResultOrder('ipv4first');

// ============================================================
// MONGOOSE MODELS
// ============================================================

const User = require('./usermodel');
const Notification = require('./notificationModel');
const Subscription = require('./subscriptionModel');

// ============================================================
// FEATURE ROUTERS
// EXACT FILENAMES FROM YOUR PROJECT
// ============================================================

const authRouter = require('./authroutes');
const activityRouter = require('./activityroutes');
const bmiRouter = require('./bmiroutes');
const notificationRouter = require('./notifications');
const pushRouter = require('./pushRoutes');
const dietplanRouter = require('./dietplanRoutes'); // <-- Registered your diet plan router

// ============================================================
// EXPRESS APP
// ============================================================

const app = express();

// Enable CORS
app.use(cors());

// Parse JSON requests
app.use(express.json());

// ============================================================
// WEB PUSH / VAPID SETUP
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
// GMAIL API SETUP
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
// SEND EMAIL USING GMAIL API
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
        `<div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
            <h2>Health App Authentication</h2>

            <p>
                Your OTP code for login is:
                <strong style="font-size: 22px; color: #007bff;">
                    ${otp}
                </strong>
            </p>

            <p>
                This code is valid for
                <strong>10 minutes</strong>.
            </p>
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
// BASE / HEALTH ENDPOINTS
// ============================================================

app.get('/', (req, res) => {
    res.status(200).send(
        'Health App Server is active and running!'
    );
});

app.get('/health', (req, res) => {
    res.status(200).send('OK');
});

// ============================================================
// OTP AUTHENTICATION
// ============================================================

// SEND OTP
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

        const otp = Math.floor(
            100000 + Math.random() * 900000
        ).toString();

        const otpExpiry = new Date(
            Date.now() + 10 * 60 * 1000
        );

        let user = await User.findOne({ email });

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

        console.log('==========================================');
        console.log(`>>> OTP FOR ${email}: [ ${otp} ] <<<`);
        console.log('==========================================');

        await sendEmailViaGmailAPI(email, otp);

        console.log(
            `>>> SUCCESS: OTP Email delivered to ${email} <<<`
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
            message: `Email sending failed: ${err.message}`
        });
    }
});

// VERIFY OTP
app.post('/api/auth/verify-otp', async (req, res) => {
    try {
        let { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({
                success: false,
                message: 'Email and OTP are required'
            });
        }

        email = email.toLowerCase().trim();

        const user = await User.findOne({ email });

        if (
            !user ||
            user.otp !== otp ||
            !user.otpExpiry ||
            user.otpExpiry < new Date()
        ) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired OTP'
            });
        }

        user.otp = null;
        user.otpExpiry = null;

        await user.save();

        const jwtSecret = process.env.JWT_SECRET;

        if (!jwtSecret) {
            console.error(
                'CRITICAL ERROR: JWT_SECRET is missing!'
            );

            return res.status(500).json({
                success: false,
                message: 'Server configuration error'
            });
        }

        const token = jwt.sign(
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
            'Verify OTP error:',
            err
        );

        return res.status(500).json({
            success: false,
            message: 'Server error during verification.'
        });
    }
});

// ============================================================
// REGISTER FEATURE ROUTERS
// ============================================================

app.use('/api/auth', authRouter);

app.use('/api/activities', activityRouter);

app.use('/api/bmi', bmiRouter);

app.use('/api/notifications', notificationRouter);

app.use('/api/push', pushRouter);

app.use('/api/diet-plan', dietplanRouter); // <-- Registered your diet-plan router

// ============================================================
// BACKGROUND SNOOZE PROCESSOR
//
// Runs every minute.
// Handles:
// YES -> Completed
// NO  -> Snoozed for 20 minutes
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

            for (const notification of dueNotifications) {

                const subscriptions =
                    await Subscription.find({
                        userId: notification.userId
                    });

                const payload = JSON.stringify({
                    title:
                        notification.title ||
                        'Health App Reminder',

                    body:
                        notification.message ||
                        'You have a scheduled reminder!',

                    id:
                        notification._id.toString(),

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
                            'Cron Push Error:',
                            err.message
                        );

                        // Remove expired subscriptions
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

                notification.status = 'Unread';
                notification.snoozedUntil = null;

                await notification.save();
            }

        } catch (err) {

            console.error(
                'Cron snooze job error:',
                err.message
            );
        }
    },
    {
        timezone: 'Asia/Kolkata'
    }
);

// ============================================================
// SLEEP REMINDER - 10:15 PM
//
// Every day at 10:15 PM India time.
// ============================================================

cron.schedule(
    '15 22 * * *',
    async () => {

        try {

            console.log(
                '>>> 10:15 PM sleep reminder scheduler started'
            );

            const users = await User.find({});

            for (const user of users) {

                // Avoid creating duplicate sleep reminders
                // for the same day.

                const today = new Intl.DateTimeFormat('en-CA', {
                    timeZone: 'Asia/Kolkata',
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit'
                }).format(new Date());

                const existing =
                    await Notification.findOne({
                        userId: user._id,
                        category: 'Reminders',
                        title: 'Sleep Time',
                        createdAt: {
                            $gte: new Date(
                                `${today}T00:00:00`
                            )
                        }
                    });

                if (existing) {
                    continue;
                }

                const notification =
                    await Notification.create({
                        userId: user._id,

                        category: 'Reminders',

                        title: 'Sleep Time',

                        message:
                            'It is 10:15 PM. Are you going to sleep?',

                        isInteractive: true,

                        status: 'Unread'
                    });

                const subscriptions =
                    await Subscription.find({
                        userId: user._id
                    });

                const payload = JSON.stringify({
                    title: 'Sleep Time',

                    body:
                        'It is 10:15 PM. Are you going to sleep?',

                    _id:
                        notification._id.toString(),

                    category: 'Reminders',

                    isInteractive: true
                });

                for (const sub of subscriptions) {

                    try {

                        await webpush.sendNotification(
                            sub,
                            payload
                        );

                    } catch (err) {

                        console.error(
                            'Sleep notification error:',
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
            }

        } catch (err) {

            console.error(
                'Sleep reminder scheduler error:',
                err.message
            );
        }

    },
    {
        timezone: 'Asia/Kolkata'
    }
);

// ============================================================
// WAKE-UP REMINDER - 6:45 AM
//
// Every day at 6:45 AM India time.
// ============================================================

cron.schedule(
    '45 6 * * *',
    async () => {

        try {

            console.log(
                '>>> 6:45 AM wake-up scheduler started'
            );

            const users = await User.find({});

            for (const user of users) {

                const notification =
                    await Notification.create({
                        userId: user._id,

                        category: 'Reminders',

                        title: 'Good Morning',

                        message:
                            'Good morning! Are you awake?',

                        isInteractive: true,

                        status: 'Unread'
                    });

                const subscriptions =
                    await Subscription.find({
                        userId: user._id
                    });

                const payload = JSON.stringify({
                    title: 'Good Morning',

                    body:
                        'Good morning! Are you awake?',

                    _id:
                        notification._id.toString(),

                    category: 'Reminders',

                    isInteractive: true
                });

                for (const sub of subscriptions) {

                    try {

                        await webpush.sendNotification(
                            sub,
                            payload
                        );

                    } catch (err) {

                        console.error(
                            'Wake-up notification error:',
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
// FOOD + WATER BACKEND REMINDERS
//
// Android native alarms will be the primary trigger in the APK.
// These server jobs provide the secondary/dual-trigger path when
// the user has web-push enabled. The notification id is returned
// to the client so Android can deduplicate the same reminder.
// ============================================================

async function sendScheduledReminder({ user, title, message, category, key }) {
    const day = new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit'
    }).format(new Date());

    const existing = await Notification.findOne({
        userId: user._id,
        category,
        title,
        message,
        createdAt: { $gte: new Date(`${day}T00:00:00+05:30`) }
    });

    if (existing) return;

    const notification = await Notification.create({
        userId: user._id,
        category,
        title,
        message,
        isInteractive: true,
        status: 'Unread'
    });

    const subscriptions = await Subscription.find({ userId: user._id });
    const payload = JSON.stringify({
        title,
        body: message,
        id: notification._id.toString(),
        key,
        date: day,
        category,
        isInteractive: true
    });

    for (const sub of subscriptions) {
        try {
            await webpush.sendNotification(sub, payload);
        } catch (err) {
            if (err.statusCode === 404 || err.statusCode === 410) {
                await Subscription.deleteOne({ endpoint: sub.endpoint });
            } else {
                console.error('Scheduled push error:', err.message);
            }
        }
    }
}

// Meal reminders: breakfast, lunch, dinner.
cron.schedule('30 8 * * *', async () => {
    try {
        for (const user of await User.find({})) {
            await sendScheduledReminder({ user, title: 'Breakfast Reminder', message: 'Time for breakfast. Have you eaten?', category: 'Meals', key: 'breakfast' });
        }
    } catch (err) { console.error('Breakfast scheduler error:', err.message); }
}, { timezone: 'Asia/Kolkata' });

cron.schedule('0 13 * * *', async () => {
    try {
        for (const user of await User.find({})) {
            await sendScheduledReminder({ user, title: 'Lunch Reminder', message: 'Time for lunch. Have you eaten?', category: 'Meals', key: 'lunch' });
        }
    } catch (err) { console.error('Lunch scheduler error:', err.message); }
}, { timezone: 'Asia/Kolkata' });

cron.schedule('30 20 * * *', async () => {
    try {
        for (const user of await User.find({})) {
            await sendScheduledReminder({ user, title: 'Dinner Reminder', message: 'Time for dinner. Have you eaten?', category: 'Meals', key: 'dinner' });
        }
    } catch (err) { console.error('Dinner scheduler error:', err.message); }
}, { timezone: 'Asia/Kolkata' });

// Water reminders through the day.
for (const waterTime of ['09:30', '11:30', '15:30', '17:30', '19:30']) {
    const [hour, minute] = waterTime.split(':');
    cron.schedule(`${minute} ${hour} * * *`, async () => {
        try {
            for (const user of await User.find({})) {
                await sendScheduledReminder({ user, title: 'Water Reminder', message: 'Time to drink water. Have you had a glass?', category: 'Hydration', key: `water-${hour}-${minute}` });
            }
        } catch (err) { console.error(`Water scheduler error (${waterTime}):`, err.message); }
    }, { timezone: 'Asia/Kolkata' });
}

// ============================================================
// MONGODB CONNECTION & SERVER START
// ============================================================

const MONGO_URI =
    process.env.MONGO_URI ||
    process.env.MONGODB_URI;

const PORT = process.env.PORT || 5000;

if (!MONGO_URI) {
    console.error(
        'CRITICAL ERROR: MONGO_URI environment variable is missing!'
    );
} else {
    mongoose
        .connect(MONGO_URI)
        .then(() => {
            console.log('>>> MongoDB Connected Successfully');
            
            // Start server only after database connection is secured
            app.listen(PORT, () => {
                console.log(
                    `>>> Server is live and listening on port ${PORT}`
                );
            });
        })
        .catch((err) => {
            console.error(
                '>>> MongoDB Connection Error:',
                err.message
            );
        });
}
