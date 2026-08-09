const express = require('express');
const router = express.Router();

// Direct imports matching your root directory layout
const Notification = require('./notificationModel'); 
const verifyToken = require('./authMiddleware');

// 1. Fetch notifications for the logged-in user
router.get('/', verifyToken, async (req, res) => {
    try {
        const userId = req.user?.id || req.user?._id || req.user?.userId;

        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized: User ID missing from token" });
        }

        // Query by userId (matching notificationModel schema)
        const notifications = await Notification.find({ userId }).sort({ createdAt: -1 });
        res.status(200).json(notifications);
    } catch (err) {
        console.error("Fetch notifications error:", err.message);
        res.status(500).json({ success: false, error: "Failed to fetch notifications" });
    }
});

// 2. Route to handle interactive responses (e.g., 'yes-water', 'yes-food', 'no-forgot', 'yes', 'no')
router.patch('/:id/respond', verifyToken, async (req, res) => {
    try {
        const { response, action } = req.body; // Accepts 'yes', 'no', 'yes-water', 'yes-food', 'no-forgot'
        const userAction = action || response;

        const notification = await Notification.findById(req.params.id);

        if (!notification) {
            return res.status(404).json({ success: false, error: "Notification not found" });
        }

        notification.actionTaken = userAction;

        // HANDLE POSITIVE RESPONSES ('yes', 'yes-water', 'yes-food')
        if (userAction === 'yes' || userAction === 'yes-water' || userAction === 'yes-food') {
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
        else if (userAction === 'no' || userAction === 'no-forgot' || userAction === 'snooze') {
            const twentyMinutesLater = new Date(Date.now() + 20 * 60 * 1000);

            notification.status = 'Snoozed';
            notification.snoozedUntil = twentyMinutesLater;
            await notification.save();

            // 20-Minute Timer Execution
            setTimeout(async () => {
                console.log(`>>> 20 MIN ELAPSED: Snooze timer expired for Notification ${req.params.id} <<<`);
                // FCM / Push notification trigger can be invoked here
            }, 20 * 60 * 1000);

            return res.status(200).json({ 
                success: true, 
                message: "Notification snoozed! Will repeat in 20 minutes.",
                snoozedUntil: twentyMinutesLater,
                notification 
            });
        }

        // DEFAULT DISMISSAL
        notification.status = 'Dismissed';
        await notification.save();

        res.status(200).json({ success: true, message: "Notification dismissed", notification });

    } catch (err) {
        console.error("Notification response error:", err.message);
        res.status(500).json({ success: false, error: "Server error processing response" });
    }
});

module.exports = router;
