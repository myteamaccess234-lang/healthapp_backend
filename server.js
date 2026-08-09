const express = require('express');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const dns = require('dns');
const jwt = require('jsonwebtoken');
const cors = require('cors'); // <--- 1. Imported CORS
require('dotenv').config();

const User = require('./usermodel'); // Ensure usermodel.js exists in the same directory

const app = express();

// Enable CORS for all incoming connections (allows Android WebView calls)
app.use(cors()); // <--- 2. Enabled CORS Middleware

// Middleware to parse incoming JSON requests
app.use(express.json());

// Create OAuth2 Transporter on Port 587 (STARTTLS) for Render compatibility
function createOAuth2Transporter() {
    return nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,               // Switches from 465 to 587 to bypass cloud firewall blocks
        secure: false,            // Must be false for port 587 (upgrades via STARTTLS)
        auth: {
            type: 'OAuth2',
            user: process.env.EMAIL_USER,
            clientId: process.env.GMAIL_CLIENT_ID,
            clientSecret: process.env.GMAIL_CLIENT_SECRET,
            refreshToken: process.env.GMAIL_REFRESH_TOKEN,
        },
        tls: {
            rejectUnauthorized: false // Prevents handshake rejections
        },
        connectionTimeout: 15000,
        greetingTimeout: 15000,
        socketTimeout: 20000
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

// 1. Route to Send OTP (Matched /api/auth/send-otp)
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

        const mailOptions = {
            from: `Health App <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Your Health App Login OTP',
            html: `<p>Your OTP code for login is: <strong>${otp}</strong>. It is valid for 10 minutes.</p>`
        };

        const transporter = createOAuth2Transporter();
        await transporter.sendMail(mailOptions);
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

// 2. Route to Verify OTP (Matched /api/auth/verify-otp)
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
