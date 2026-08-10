const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const User = require('./usermodel');
const jwt = require('jsonwebtoken');
const dns = require('dns');

// Force Node.js DNS resolution to prioritize IPv4 over IPv6
dns.setDefaultResultOrder('ipv4first');

// Reuse transporter instance with explicit IPv4 host configurations
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // Use SSL/TLS
    family: 4,    // Force Nodemailer to establish connection strictly using IPv4
    auth: {
        type: 'OAuth2',
        user: process.env.EMAIL_USER,
        clientId: process.env.GMAIL_CLIENT_ID,
        clientSecret: process.env.GMAIL_CLIENT_SECRET,
        refreshToken: process.env.GMAIL_REFRESH_TOKEN,
    },
});

// 1. Route to Send OTP
router.post('/send-otp', async (req, res) => {
    try {
        let { email } = req.body;
        if (!email) {
            return res.status(400).json({ success: false, message: "Email is required" });
        }

        // Normalize email to handle case-sensitivity issues safely
        email = email.toLowerCase().trim();

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

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
            html: `
              <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                <h2>Health App Authentication</h2>
                <p>Your OTP code for login is: <strong style="font-size: 22px; color: #007bff;">${otp}</strong></p>
                <p>This code is valid for <strong>10 minutes</strong>.</p>
              </div>
            `
        };

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

// 2. Route to Verify OTP
router.post('/verify-otp', async (req, res) => {
    try {
        let { email, otp } = req.body;
        if (!email || !otp) {
            return res.status(400).json({ success: false, message: "Email and OTP are required" });
        }

        // Normalize email
        email = email.toLowerCase().trim();

        const user = await User.findOne({ email });
        if (!user || user.otp !== otp || user.otpExpiry < new Date()) {
            return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
        }

        // Clear OTP fields after successful login
        user.otp = null;
        user.otpExpiry = null;
        await user.save();

        // Enforce secure JWT configuration
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            console.error("CRITICAL ERROR: JWT_SECRET environment variable is not defined!");
            return res.status(500).json({ success: false, message: "Server configuration error" });
        }

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

module.exports = router;
