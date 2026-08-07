const express = require('express');
const router = express.Router();
const { Resend } = require('resend');
const User = require('./usermodel');
const jwt = require('jsonwebtoken');

// Initialize Resend HTTPS API (No Nodemailer, No Port 587, No IPv6 Errors)
const resend = new Resend(process.env.RESEND_API_KEY);

// 1. Route to Send OTP
router.post('/send-otp', async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ success: false, message: "Email is required" });
        }

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

        // Save to Database
        let user = await User.findOne({ email });
        if (!user) {
            user = new User({ email, otp, otpExpiry });
        } else {
            user.otp = otp;
            user.otpExpiry = otpExpiry;
        }
        await user.save();

        // PRINT OTP TO RENDER CONSOLE (For instant testing!)
        console.log(`==========================================`);
        console.log(`>>> OTP FOR ${email}: [ ${otp} ] <<<`);
        console.log(`==========================================`);

        // Send Email via Resend HTTPS API (Destructure data and error properly)
        const { data, error } = await resend.emails.send({
            from: 'Health App <onboarding@resend.dev>',
            to: [email],
            subject: 'Your Health App Login OTP',
            html: `<p>Your OTP for login is: <strong>${otp}</strong>. It is valid for 10 minutes.</p>`
        });

        if (error) {
            console.error("Resend API Error:", error);
            return res.status(500).json({ success: false, message: error.message });
        }

        res.status(200).json({ success: true, message: "OTP sent successfully." });
    } catch (err) {
        console.error("FULL SEND-OTP ERROR STACK:", err);
        res.status(500).json({ success: false, message: err.message });
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
