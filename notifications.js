const express = require('express');
const router = express.Router();

// Direct imports matching root directory layout
const Notification = require('./notificationModel'); 
const verifyToken = require('./authMiddleware');

// 1. Fetch notifications for the logged-in user
router.get('/', verifyToken, async (req, res) => {
    try {
        const userId = req.user?.id || req.user?._id || req.user?.userId;

        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized: User ID missing from token" });
        }

        // Query notifications by userId ordered by newest first
        const notifications = await Notification.find({ userId }).sort({ createdAt: -1 });
        res.status(200).json(notifications);
    } catch (err) {
        console.error("Fetch notifications error:", err.message);
        res.status(500).json({ success: false, error: "Failed to fetch notifications" });
    }
});

// 2. Handle interactive responses (e.g., 'yes-water', 'yes-food', 'no-forgot', 'yes', 'no')
router.patch('/:id/respond', verifyToken, async (req, res) => {
    try {
        const { response, action } = req.body; // Accepts 'yes', 'no', 'yes-water', 'yes-food', 'no-forgot', 'snooze'
        const userAction = action || response;

        if (!userAction) {
            return res.status(400).json({ success: false, message: "Response action is required" });
        }

        const notification = await Notification.findById(req.params.id);

        if (!notification) {
            return res.status(404).json({ success: false, error: "Notification not found" });
        }

        notification.actionTaken = userAction;

        // HANDLE POSITIVE RESPONSES ('yes', 'yes-water', 'yes-food')
        if (['yes', 'yes-water', 'yes-food'].includes(userAction)) {
            notification.status = 'Completed';
            notification.snoozedUntil = null;
            await notification.save();

            return res.status(200).json({ 
                success: true, 
                message: "Response recorded as Completed!", 
                notification 
            });
        } 
        
        // HANDLE SNOOZE / NEGATIVE RESPONSES ('no', 'no-forgot', 'snooze')
        else if (['no', 'no-forgot', 'snooze'].includes(userAction)) {
            const twentyMinutesLater = new Date(Date.now() + 20 * 60 * 1000);

            notification.status = 'Snoozed';
            notification.snoozedUntil = twentyMinutesLater;
            await notification.save();

            console.log(`>>> NOTIFICATION ${req.params.id} SNOOZED UNTIL: ${twentyMinutesLater.toISOString()} <<<`);

            return res.status(200).json({ 
                success: true, 
                message: "Notification snoozed! Will repeat in 20 minutes.",
                snoozedUntil: twentyMinutesLater,
                notification 
            });
        }

        // DEFAULT DISMISSAL
        notification.status = 'Dismissed';
        notification.snoozedUntil = null;
        await notification.save();

        res.status(200).json({ success: true, message: "Notification dismissed", notification });

    } catch (err) {
        console.error("Notification response error:", err.message);
        res.status(500).json({ success: false, error: "Server error processing response" });
    }
});

module.exports = router;
