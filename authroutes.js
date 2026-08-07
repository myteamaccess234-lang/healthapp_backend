const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const User = require('./usermodel');
const jwt = require('jsonwebtoken');

// Configure Nodemailer with Gmail SMTP
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, // Your Gmail address from Render Environment
        pass: process.env.EMAIL_PASS  // Your 16-character App Password from Render Environment
    }
});

// 1. Route to Send OTP
router.post('/send-otp', async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ success: false, message: "Email is required" });
        }

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // Valid for 10 minutes

        // Find user or create a new document
        let user = await User.findOne({ email });
        if (!user) {
            user = new User({ email, otp, otpExpiry });
        } else {
            user.otp = otp;
            user.otpExpiry = otpExpiry;
        }
        await user.save();

        // Send Email via Gmail Nodemailer
        await transporter.sendMail({
            from: `"Health App" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Your Health App Login OTP',
            html: `<p>Your OTP for login is: <strong>${otp}</strong>. It is valid for 10 minutes.</p>`
        });

        res.status(200).json({ success: true, message: "OTP sent successfully to your email." });
    } catch (err) {
        console.error("FULL SEND-OTP ERROR STACK:", err);
        res.status(500).json({ success: false, message: err.message });
    }
});

// 2. Route to Verify OTP and Issue JWT Token
router.post('/verify-otp', async (req, res) => {
    try {
        const { email, otp } = req.body;
        if (!email || !otp) {
            return res.status(400).json({ success: false, message: "Email and OTP are required" });
        }

        const user = await User.findOne({ email });
        if (!user || user.otp !== otp || user.otpExpiry < new Date()) {
            return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
        }

        // Clear OTP fields after successful verification
        user.otp = null;
        user.otpExpiry = null;
        await user.save();

        // Create JWT token containing user id and email
        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET,
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
