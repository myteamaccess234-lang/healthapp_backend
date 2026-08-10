const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const cron = require('node-cron');
const webpush = require('web-push');
const { google } = require('googleapis');
const dns = require('dns');
require('dotenv').config();

// Force Node.js DNS resolution to prioritize IPv4 globally over IPv6
dns.setDefaultResultOrder('ipv4first');

// Mongoose Models
const User = require('./usermodel');
const Notification = require('./notificationModel');
const Subscription = require('./subscriptionModel');

// Import Feature Routers
const authRouter = require('./authroutes');
const activityRouter = require('./activityroutes');
const bmiRouter = require('./bmiroutes');
const notificationRouter = require('./notifications');
const pushRouter = require('./pushRoutes');

const app = express();

// Enable CORS for cross-origin apps & PWAs
app.use(cors());

// Middleware to parse incoming JSON requests
app.use(express.json());

// ------------------- VAPID WEB-PUSH SETUP -------------------

if (process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
    webpush.setVapidDetails(
        process.env.VAPID_MAILTO || 'mailto:support@example.com',
        process.env.VAPID_PUBLIC_KEY,
        process.env.VAPID_PRIVATE_KEY
    );
} else {
    console.warn("⚠️ VAPID keys missing in environment variables. Web push notifications may fail.");
}

// ------------------- GMAIL API REST SETUP (HTTPS Over Port 443) -------------------

const OAuth2 = google.auth.OAuth2;
const oauth2Client = new OAuth2(
    process.env.GMAIL_CLIENT_ID,
    process.env.GMAIL_CLIENT_SECRET,
    "https://developers.google.com/oauthplayground"
);

oauth2Client.setCredentials({
    refresh_token: process.env.GMAIL_REFRESH_TOKEN
});

// Helper function to send emails via Gmail API over HTTPS
async function sendEmailViaGmailAPI(toEmail, otp) {
    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

    const subject = 'Your Health App Login OTP';
    const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString('base64')}?=`;
    const messageParts = [
        `From: Health App <${process.env.EMAIL_USER}>`,
        `To: ${toEmail}`,
        `Subject: ${utf8Subject}`,
        'Content-Type: text/html; charset=utf-8',
        'MIME-Version: 1.0',
        '',
        `<div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
            <h2>Health App Authentication</h2>
            <p>Your OTP code for login is: <strong style="font-size: 22px; color: #007bff;">${otp}</strong></p>
            <p>This code is valid for <strong>10 minutes</strong>.</p>
         </div>`
    ];
    const message = messageParts.join('\n');

    // Base64Url encode the raw email payload
    const encodedMessage = Buffer.from(message)
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');

    await gmail.users.messages.send({
        userId: 'me',
        requestBody: {
            raw: encodedMessage,
        },
    });
}

// ------------------- BASE & HEALTH ENDPOINTS -------------------

app.get('/', (req, res) => {
    res.send('Health App Server is active and running!');
});

app.get('/health', (req, res) => {
    res.status(200).send('OK');
});

// ------------------- OTP AUTHENTICATION ENDPOINTS -------------------

// Send OTP Route
app.post('/api/auth/send-otp', async (req, res) => {
    try {
        let { email } = req.body;
        if (!email) {
            return res.status(400).json({ success: false, message: "Email is required" });
        }

        email = email.toLowerCase().trim();

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

        let user = await User.findOne({ email });
        if (!user) {
            user = new User({ email, otp, otpExpiry });
        } else {
            user.otp = otp;
            user.otpExpiry = otpExpiry;
        }
        await user.save();

        console.log(`==========================================`);
        console.log(`>>> OTP FOR ${email}: [ ${otp} ] <<<`);
        console.log(`==========================================`);

        // Send Email via Gmail REST API (Over HTTPS Port 443)
        await sendEmailViaGmailAPI(email, otp);
        console.log(`>>> SUCCESS: OTP Email delivered to ${email} <<<`);

        return res.status(200).json({ success: true, message: "OTP sent successfully." });

    } catch (err) {
        console.error("SEND-OTP FAILED:", err.message);
        return res.status(500).json({ 
            success: false, 
            message: `Email sending failed: ${err.message}` 
        });
    }
});

// Verify OTP Route
app.post('/api/auth/verify-otp', async (req, res) => {
    try {
        let { email, otp } = req.body;
        if (!email || !otp) {
            return res.status(400).json({ success: false, message: "Email and OTP are required" });
        }

        email = email.toLowerCase().trim();

        const user = await User.findOne({ email });
        if (!user || user.otp !== otp || user.otpExpiry < new Date()) {
            return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
        }

        user.otp = null;
        user.otpExpiry = null;
        await user.save();

        const jwtSecret = process.env.JWT_SECRET || 'fallback_secret';
        const token = jwt.sign(
            { id: user._id, email: user.email },
            jwtSecret,
            { expiresIn: '7d' }
        );

        res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            email: user.email,
            user: { id: user._id, email: user.email }
        });
    } catch (err) {
        console.error("Verify OTP error:", err);
        res.status(500).json({ success: false, message: "Server error during verification." });
    }
});

// ------------------- REGISTER FEATURE ROUTERS -------------------

app.use('/api/auth', authRouter);
app.use('/api/activities', activityRouter);
app.use('/api/bmi', bmiRouter);
app.use('/api/notifications', notificationRouter);
app.use('/api/push', pushRouter);

// ------------------- BACKGROUND SNOOZE SCHEDULER -------------------

cron.schedule('* * * * *', async () => {
    try {
        const now = new Date();
        const dueNotifications = await Notification.find({
            status: 'Snoozed',
            snoozedUntil: { $lte: now }
        });

        for (const notification of dueNotifications) {
            const subscriptions = await Subscription.find({ userId: notification.userId });
            
            const payload = JSON.stringify({
                title: `⏰ Reminder: ${notification.title || 'Health Alert'}`,
                body: notification.message || notification.body || 'You have a scheduled reminder!',
                id: notification._id.toString(),
                category: notification.category || 'General'
            });

            for (const sub of subscriptions) {
                webpush.sendNotification({
                    endpoint: sub.endpoint,
                    keys: sub.keys
                }, payload).catch((err) => console.error("Cron Push Error:", err.message));
            }

            notification.status = 'Unread';
            notification.snoozedUntil = null;
            await notification.save();
        }
    } catch (err) {
        console.error("Cron snooze job error:", err.message);
    }
});

// ------------------- SERVER & DB INITIALIZATION -------------------

const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;

if (!MONGO_URI) {
    console.error("CRITICAL ERROR: MONGO_URI environment variable is missing!");
} else {
    mongoose.connect(MONGO_URI)
        .then(() => console.log('>>> MongoDB Connected Successfully'))
        .catch(err => console.error('>>> MongoDB Connection Error:', err.message));
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`>>> Server is live and listening on port ${PORT}`);
});
