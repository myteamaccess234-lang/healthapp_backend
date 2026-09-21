const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const User = require('./usermodel');
const jwt = require('jsonwebtoken');
const dns = require('dns');

// ============================================================
// DNS
// ============================================================

dns.setDefaultResultOrder('ipv4first');

// ============================================================
// GMAIL SMTP TRANSPORTER
// ============================================================

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    family: 4,
    auth: {
        type: 'OAuth2',
        user: process.env.EMAIL_USER,
        clientId: process.env.GMAIL_CLIENT_ID,
        clientSecret: process.env.GMAIL_CLIENT_SECRET,
        refreshToken: process.env.GMAIL_REFRESH_TOKEN
    }
});

// ============================================================
// OTP CONFIGURATION
// ============================================================

const OTP_EXPIRY_MINUTES = 10;
const OTP_LENGTH = 6;

// Generate secure 6-digit OTP
function generateOTP() {
    return Math.floor(
        100000 + Math.random() * 900000
    ).toString();
}

// Normalize email
function normalizeEmail(email) {
    return String(email || '')
        .trim()
        .toLowerCase();
}

// ============================================================
// SEND OTP
// Used for BOTH first OTP and RESEND OTP
// ============================================================

router.post('/send-otp', async (req, res) => {
    try {
        const email = normalizeEmail(req.body.email);

        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email is required.'
            });
        }

        // Basic email validation
        const emailRegex =
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Please enter a valid email address.'
            });
        }

        // Generate completely NEW OTP
        const otp = generateOTP();

        // OTP valid for 10 minutes
        const otpExpiry = new Date(
            Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000
        );

        // Find existing user
        let user = await User.findOne({ email });

        // Create user if first login
        if (!user) {
            user = new User({
                email,
                otp,
                otpExpiry
            });
        } else {
            // RESEND:
            // Replace old OTP with the NEW OTP
            user.otp = otp;
            user.otpExpiry = otpExpiry;
        }

        await user.save();

        console.log('==========================================');
        console.log(`>>> NEW OTP GENERATED FOR: ${email}`);
        console.log(`>>> OTP: ${otp}`);
        console.log(
            `>>> EXPIRES: ${otpExpiry.toLocaleString()}`
        );
        console.log('==========================================');

        // Email
        const mailOptions = {
            from: `Health App <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Your Health App Login OTP',
            html: `
                <div style="
                    font-family: Arial, sans-serif;
                    max-width: 500px;
                    margin: auto;
                    padding: 25px;
                    background: #f7f9fc;
                    border-radius: 12px;
                    color: #333;
                ">

                    <h2 style="color:#007bff;">
                        Health App Authentication
                    </h2>

                    <p>
                        Your new OTP for Health App login is:
                    </p>

                    <div style="
                        font-size: 30px;
                        font-weight: bold;
                        letter-spacing: 8px;
                        color: #007bff;
                        padding: 15px 0;
                    ">
                        ${otp}
                    </div>

                    <p>
                        This OTP is valid for
                        <strong>${OTP_EXPIRY_MINUTES} minutes</strong>.
                    </p>

                    <p style="color:#777;font-size:13px;">
                        If you did not request this OTP,
                        you can safely ignore this email.
                    </p>

                </div>
            `
        };

        await transporter.sendMail(mailOptions);

        console.log(
            `>>> OTP EMAIL SUCCESSFULLY SENT TO: ${email}`
        );

        return res.status(200).json({
            success: true,
            message: 'OTP sent successfully.'
        });

    } catch (err) {

        console.error(
            '=========================================='
        );

        console.error(
            'SEND OTP ERROR:',
            err
        );

        console.error(
            '=========================================='
        );

        return res.status(500).json({
            success: false,
            message:
                'Unable to send OTP right now. Please try again.'
        });
    }
});

// ============================================================
// VERIFY OTP
// ============================================================

router.post('/verify-otp', async (req, res) => {
    try {
        const email = normalizeEmail(req.body.email);
        const otp = String(req.body.otp || '').trim();

        if (!email || !otp) {
            return res.status(400).json({
                success: false,
                message: 'Email and OTP are required.'
            });
        }

        // OTP must be exactly 6 digits
        if (!/^\d{6}$/.test(otp)) {
            return res.status(400).json({
                success: false,
                message: 'Please enter a valid 6-digit OTP.'
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'No account found for this email.'
            });
        }

        // No OTP stored
        if (!user.otp || !user.otpExpiry) {
            return res.status(400).json({
                success: false,
                message: 'OTP expired. Please request a new OTP.'
            });
        }

        // OTP expired
        if (user.otpExpiry < new Date()) {

            user.otp = null;
            user.otpExpiry = null;

            await user.save();

            return res.status(400).json({
                success: false,
                message: 'OTP expired. Please request a new OTP.'
            });
        }

        // OTP doesn't match
        if (user.otp !== otp) {
            return res.status(400).json({
                success: false,
                message: 'Incorrect OTP. Please check and try again.'
            });
        }

        // ====================================================
        // OTP SUCCESS
        // ====================================================

        // Remove OTP immediately so it cannot be reused
        user.otp = null;
        user.otpExpiry = null;

        await user.save();

        // ====================================================
        // JWT
        // ====================================================

        const jwtSecret = process.env.JWT_SECRET;

        if (!jwtSecret) {
            console.error(
                'CRITICAL ERROR: JWT_SECRET is missing.'
            );

            return res.status(500).json({
                success: false,
                message: 'Server configuration error.'
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

        console.log(
            `>>> LOGIN SUCCESS: ${user.email}`
        );

        return res.status(200).json({
            success: true,
            message: 'Login successful.',
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
            message: 'Server error during verification.'
        });
    }
});

// ============================================================
// EXPORT
// ============================================================

module.exports = router;
