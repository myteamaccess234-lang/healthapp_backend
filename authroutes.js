const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const User = require('./usermodel');
const jwt = require('jsonwebtoken');

// Configure Nodemailer explicitly forcing IPv4 family
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    family: 4, // Prevents ENETUNREACH IPv6 routing errors on Render
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 10000
});

// 1. Route to Send OTP
router.post('/send-otp', async (req, res) => {
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

        // Send mail via IPv4 Nodemailer transport
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
