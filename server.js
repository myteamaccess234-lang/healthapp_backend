const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const { google } = require('googleapis');
require('dotenv').config();

const User = require('./usermodel'); // Ensure usermodel.js exists in the same directory

const app = express();

// Enable CORS for all incoming connections
app.use(cors());

// Middleware to parse incoming JSON requests
app.use(express.json());

// Set up Google OAuth2 Client for Gmail REST API (Uses HTTPS over Port 443)
const OAuth2 = google.auth.OAuth2;
const oauth2Client = new OAuth2(
    process.env.GMAIL_CLIENT_ID,
    process.env.GMAIL_CLIENT_SECRET,
    "https://developers.google.com/oauthplayground"
);

oauth2Client.setCredentials({
    refresh_token: process.env.GMAIL_REFRESH_TOKEN
});

// Helper function to send email via Gmail API over HTTPS
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
        `<p>Your OTP code for login is: <strong>${otp}</strong>. It is valid for 10 minutes.</p>`
    ];
    const message = messageParts.join('\n');

    // Base64Url encode the message for Gmail API
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

// ------------------- ROUTES -------------------

// Root endpoint
app.get('/', (req, res) => {
    res.send('Server is active and running!');
});

// Health check endpoint for keep-awake services & cron jobs
app.get('/health', (req, res) => {
    res.status(200).send('OK');
});

// 1. Route to Send OTP
app.post('/api/auth/send-otp', async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ success: false, message: "Email is required" });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

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

        // Send via HTTPS REST API (Bypasses Render SMTP blocks)
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

// 2. Route to Verify OTP
app.post('/api/auth/verify-otp', async (req, res) => {
    try {
        const { email, otp } = req.body;
        if (!email || !otp) {
            return res.status(400).json({ success: false, message: "Email and OTP are required" });
        }

        const user = await User.findOne({ email });
        if (!user || user.otp !== otp || user.otpExpiry < new Date()) {
            return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
        }

        user.otp = null;
        user.otpExpiry = null;
        await user.save();

        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET || 'fallback_secret',
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

// Connect MongoDB if MONGO_URI is supplied
if (process.env.MONGO_URI || process.env.MONGODB_URI) {
    mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI)
        .then(() => console.log('>>> MongoDB Connected Successfully'))
        .catch(err => console.error('>>> MongoDB Connection Error:', err.message));
}

// Dynamic PORT binding for Render
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`>>> Server is live and listening on port ${PORT}`);
});
