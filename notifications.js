const express = require('express');
const router = express.Router();

// Direct imports matching your exact project filenames
const Notification = require('./notificationModel');
const Activity = require('./activityModel');
const verifyToken = require('./authMiddleware');

// ============================================================
// HELPER: GET CURRENT DATE IN INDIA
// ============================================================

function getIndiaDate() {
    return new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Asia/Kolkata',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    }).format(new Date());
}

// ============================================================
// 1. FETCH NOTIFICATIONS FOR LOGGED-IN USER
// ============================================================

router.get('/', verifyToken, async (req, res) => {
    try {
        const userId =
            req.user?.id ||
            req.user?._id ||
            req.user?.userId;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized: User ID missing from token'
            });
        }

        const notifications = await Notification
            .find({ userId })
            .sort({ createdAt: -1 });

        res.status(200).json(notifications);

    } catch (err) {
        console.error(
            'Fetch notifications error:',
            err.message
        );

        res.status(500).json({
            success: false,
            error: 'Failed to fetch notifications'
        });
    }
});

// ============================================================
// 2. HANDLE NOTIFICATION RESPONSES
// ============================================================

router.patch('/:id/respond', verifyToken, async (req, res) => {
    try {

        const {
            response,
            action
        } = req.body;

        const userAction = action || response;

        if (!userAction) {
            return res.status(400).json({
                success: false,
                message: 'Response action is required'
            });
        }

        const userId =
            req.user?.id ||
            req.user?._id ||
            req.user?.userId;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized: User ID missing from token'
            });
        }

        // =====================================================
        // FIND NOTIFICATION
        // IMPORTANT: Make sure this notification belongs
        // to the currently logged-in user.
        // =====================================================

        const notification =
            await Notification.findOne({
                _id: req.params.id,
                userId: userId
            });

        if (!notification) {
            return res.status(404).json({
                success: false,
                error: 'Notification not found'
            });
        }

        notification.actionTaken = userAction;

        // =====================================================
        // SLEEP: NIGHT YES
        // =====================================================

        const isSleepNotification =
            notification.category === 'Reminders' &&
            notification.title === 'Sleep Time';

        if (
            isSleepNotification &&
            (
                userAction === 'yes' ||
                userAction === 'start-sleep'
            )
        ) {

            const today = getIndiaDate();

            // Find today's activity record
            let activity =
                await Activity.findOne({
                    userId,
                    date: today
                });

            // Create today's activity if it doesn't exist
            if (!activity) {
                activity = new Activity({
                    userId,
                    date: today
                });
            }

            // Start sleep
            activity.sleepStart = new Date();
            activity.sleepEnd = null;
            activity.sleepMinutes = 0;
            activity.isSleeping = true;

            await activity.save();

            // Mark notification completed
            notification.status = 'Completed';
            notification.snoozedUntil = null;

            await notification.save();

            console.log(
                `>>> SLEEP STARTED FOR USER ${userId} AT ${activity.sleepStart.toISOString()} <<<`
            );

            return res.status(200).json({
                success: true,
                message: 'Sleep tracking started.',
                action: 'start-sleep',
                sleepStartedAt: activity.sleepStart,
                activity
            });
        }

        // =====================================================
        // SLEEP: MORNING YES
        // =====================================================

        const isWakeNotification =
            notification.category === 'Reminders' &&
            notification.title === 'Good Morning';

        if (
            isWakeNotification &&
            (
                userAction === 'yes' ||
                userAction === 'wake-up'
            )
        ) {

            // Find the currently active sleep session.
            // This is important because sleep started yesterday
            // and the user wakes up today.

            const activity =
                await Activity.findOne({
                    userId,
                    isSleeping: true
                }).sort({
                    sleepStart: -1
                });

            if (!activity || !activity.sleepStart) {

                notification.status = 'Completed';
                notification.snoozedUntil = null;

                await notification.save();

                return res.status(400).json({
                    success: false,
                    message:
                        'No active sleep session was found.'
                });
            }

            // Current wake-up time
            const sleepEnd = new Date();

            // Calculate milliseconds
            const differenceMs =
                sleepEnd.getTime() -
                activity.sleepStart.getTime();

            // Convert milliseconds to minutes
            const sleepMinutes =
                Math.max(
                    0,
                    Math.round(differenceMs / (1000 * 60))
                );

            // Save sleep information
            activity.sleepEnd = sleepEnd;
            activity.sleepMinutes = sleepMinutes;
            activity.isSleeping = false;

            await activity.save();

            // Complete morning notification
            notification.status = 'Completed';
            notification.snoozedUntil = null;

            await notification.save();

            console.log(
                `>>> SLEEP STOPPED FOR USER ${userId} <<<`
            );

            console.log(
                `>>> SLEEP DURATION: ${sleepMinutes} MINUTES <<<`
            );

            return res.status(200).json({
                success: true,
                message: 'Sleep tracking stopped successfully.',
                action: 'wake-up',
                sleepStartedAt: activity.sleepStart,
                sleepEndedAt: activity.sleepEnd,
                sleepMinutes: activity.sleepMinutes,
                activity
            });
        }

        // =====================================================
        // NORMAL POSITIVE RESPONSES
        //
        // Water, food and other existing notifications
        // continue working.
        // =====================================================

        if (['yes-water', 'yes-food'].includes(userAction)) {
            const today = getIndiaDate();
            let activity = await Activity.findOne({ userId, date: today });

            if (!activity) {
                activity = new Activity({ userId, date: today });
            }

            if (userAction === 'yes-water') {
                activity.waterLitres = Number(
                    (
                        Number(activity.waterLitres || 0) + 0.25
                    ).toFixed(2)
                );
            } else if (userAction === 'yes-food') {
                activity.mealCount =
                    Number(activity.mealCount || 0) + 1;

                activity.calorieIntake =
                    Number(activity.calorieIntake || 0) + 500;
            }

            await activity.save();

            notification.status = 'Completed';
            notification.snoozedUntil = null;

            await notification.save();

            return res.status(200).json({
                success: true,
                message:
                    userAction === 'yes-water'
                        ? 'Water intake recorded.'
                        : 'Meal recorded.',
                action: userAction,
                activity,
                notification
            });
        }

        if (
            ['yes', 'start-sleep', 'wake-up']
                .includes(userAction)
        ) {
            notification.status = 'Completed';
            notification.snoozedUntil = null;

            await notification.save();

            return res.status(200).json({
                success: true,
                message: 'Response recorded as Completed!',
                action: userAction,
                notification
            });
        }

        // =====================================================
        // NO / SNOOZE
        //
        // Existing 20-minute behavior remains unchanged.
        // =====================================================

        if (
            [
                'no',
                'no-forgot',
                'snooze'
            ].includes(userAction)
        ) {

            const twentyMinutesLater =
                new Date(
                    Date.now() + 20 * 60 * 1000
                );

            notification.status = 'Snoozed';
            notification.snoozedUntil =
                twentyMinutesLater;

            await notification.save();

            console.log(
                `>>> NOTIFICATION ${req.params.id} SNOOZED UNTIL: ${twentyMinutesLater.toISOString()} <<<`
            );

            return res.status(200).json({
                success: true,
                message:
                    'Notification snoozed! Will repeat in 20 minutes.',
                snoozedUntil:
                    twentyMinutesLater,
                notification
            });
        }

        // =====================================================
        // DEFAULT DISMISSAL
        // =====================================================

        notification.status = 'Dismissed';
        notification.snoozedUntil = null;

        await notification.save();

        return res.status(200).json({
            success: true,
            message: 'Notification dismissed',
            notification
        });

    } catch (err) {

        console.error(
            'Notification response error:',
            err.message
        );

        res.status(500).json({
            success: false,
            error:
                'Server error processing response'
        });
    }
});

// ============================================================
// 3. DELETE NOTIFICATION
// ============================================================

router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const userId =
            req.user?.id ||
            req.user?._id ||
            req.user?.userId;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized: User ID missing from token'
            });
        }

        const notification =
            await Notification.findOneAndDelete({
                _id: req.params.id,
                userId: userId
            });

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: 'Notification not found'
            });
        }

        console.log(
            `>>> NOTIFICATION ${req.params.id} DELETED FOR USER ${userId} <<<`
        );

        return res.status(200).json({
            success: true,
            message: 'Notification deleted successfully'
        });

    } catch (err) {
        console.error(
            'Delete notification error:',
            err.message
        );

        return res.status(500).json({
            success: false,
            message: 'Failed to delete notification'
        });
    }
});

module.exports = router;
