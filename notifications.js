const express = require('express');
const router = express.Router();
const Notification = require('../models/notificationModel'); // Adjust path
const verifyToken = require('../middleware/authMiddleware');

// Fetch notifications using the email from the verified JWT token
router.get('/', verifyToken, async (req, res) => {
    try {
        // Query by email instead of passing an unsafe URL param
        const notifications = await Notification.find({ email: req.user.email }).sort({ createdAt: -1 });
        res.status(200).json(notifications);
    } catch (err) {
        console.error("Fetch notifications error:", err);
        res.status(500).json({ error: "Failed to fetch notifications" });
    }
});

// Route to handle interactive responses (e.g., Yes/No buttons)
router.patch('/:id/respond', verifyToken, async (req, res) => {
    try {
        const { response } = req.body; // 'yes' or 'no'
        const notification = await Notification.findById(req.params.id);

        if (!notification) {
            return res.status(404).json({ error: "Notification not found" });
        }

        notification.status = response === 'yes' ? 'Completed' : 'Dismissed';
        await notification.save();

        res.status(200).json({ success: true, message: "Response recorded successfully!" });
    } catch (err) {
        console.error("Notification response error:", err);
        res.status(500).json({ error: "Server error processing response" });
    }
});

module.exports = router;