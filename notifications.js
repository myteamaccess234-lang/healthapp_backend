
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
// HELPER: GET LOGGED-IN USER ID
// ============================================================

function getUserId(req) {
    return (
        req.user?.id ||
        req.user?._id ||
        req.user?.userId ||
        null
    );
}

// ============================================================
// HELPER: IDENTIFY REMINDER TYPE
// ============================================================

function getReminderType(notification) {
    const category = String(notification.category || '')
        .trim()
        .toLowerCase();

    const title = String(notification.title || '')
        .trim()
        .toLowerCase();

    if (
        ['reminders', 'sleep'].includes(category) &&
        ['sleep time', 'bedtime', 'start sleep'].includes(title)
    ) {
        return 'sleep-start';
    }

    if (
        ['reminders', 'sleep'].includes(category) &&
        ['good morning', 'wake up', 'wake-up'].includes(title)
    ) {
        return 'sleep-end';
    }

    if (
        category === 'hydration' ||
        title.includes('water') ||
        title.includes('hydration')
    ) {
        return 'water';
    }

    if (
        category === 'meals' ||
        title.includes('meal') ||
        title.includes('food')
    ) {
        return 'meal';
    }

    return 'general';
}

// ============================================================
// 1. SAVE NOTIFICATION FROM ANDROID APP
// ============================================================

router.post('/', verifyToken, async (req, res) => {
    try {
        const userId = getUserId(req);

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized: User ID missing from token'
            });
        }

        const {
            category,
            title,
            message,
            isInteractive
        } = req.body;

        if (
            typeof title !== 'string' ||
            !title.trim() ||
            typeof message !== 'string' ||
            !message.trim()
        ) {
            return res.status(400).json({
                success: false,
                message: 'Title and message are required'
            });
        }

        const allowedCategories = [
            'Hydration',
            'Meals',
            'Reminders',
            'Sleep',
            'General'
        ];

        const notificationCategory =
            allowedCategories.includes(category)
                ? category
                : 'General';

        const notification = await Notification.create({
            userId,
            category: notificationCategory,
            title: title.trim(),
            message: message.trim(),
            isInteractive: isInteractive === true,
            status: 'Unread'
        });

        console.log(
            `>>> NOTIFICATION SAVED FOR USER ${userId} <<<`
        );

        return res.status(201).json({
            success: true,
            message: 'Notification saved successfully',
            notification
        });

    } catch (err) {
        console.error(
            'Save notification error:',
            err.message
        );

        return res.status(500).json({
            success: false,
            error: 'Failed to save notification'
        });
    }
});

// ============================================================
// 2. FETCH NOTIFICATIONS FOR LOGGED-IN USER
// ============================================================

router.get('/', verifyToken, async (req, res) => {
    try {
        const userId = getUserId(req);

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized: User ID missing from token'
            });
        }

        const notifications = await Notification
            .find({ userId })
            .sort({ createdAt: -1 });

        return res.status(200).json(notifications);

    } catch (err) {
        console.error(
            'Fetch notifications error:',
            err.message
        );

        return res.status(500).json({
            success: false,
            error: 'Failed to fetch notifications'
        });
    }
});

// ============================================================
// 3. SLEEP TRACKER: GET CURRENT / LATEST SLEEP STATUS
// GET /api/notifications/sleep/status
// ============================================================

router.get('/sleep/status', verifyToken, async (req, res) => {
    try {
        const userId = getUserId(req);

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized: User ID missing from token'
            });
        }

        const activity = await Activity.findOne({
            userId,
            $or: [
                { isSleeping: true },
                { sleepStart: { $ne: null } }
            ]
        }).sort({
            sleepStart: -1
        });

        if (!activity) {
            return res.status(200).json({
                success: true,
                isSleeping: false,
                message: 'No sleep session found',
                sleep: null
            });
        }

        return res.status(200).json({
            success: true,
            isSleeping: activity.isSleeping === true,
            sleep: {
                sleepStart: activity.sleepStart,
                sleepEnd: activity.sleepEnd,
                sleepMinutes: activity.sleepMinutes || 0,
                isSleeping: activity.isSleeping === true
            }
        });

    } catch (err) {
        console.error(
            'Sleep status error:',
            err.message
        );

        return res.status(500).json({
            success: false,
            message: 'Failed to retrieve sleep status'
        });
    }
});

// ============================================================
// 4. HANDLE NOTIFICATION RESPONSES
// Only YES and NO are accepted.
// ============================================================

router.patch('/:id/respond', verifyToken, async (req, res) => {
    try {
        const userId = getUserId(req);

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized: User ID missing from token'
            });
        }

        const rawResponse =
            req.body?.response ??
            req.body?.action;

        const userAction =
            typeof rawResponse === 'string'
                ? rawResponse.trim().toLowerCase()
                : '';

        if (!['yes', 'no'].includes(userAction)) {
            return res.status(400).json({
                success: false,
                message: 'Response must be Yes or No'
            });
        }

        // Find notification belonging to this user.
        const notification = await Notification.findOne({
            _id: req.params.id,
            userId
        });

        if (!notification) {
            return res.status(404).json({
                success: false,
                error: 'Notification not found'
            });
        }

        if (notification.status === 'Completed') {
            return res.status(200).json({
                success: true,
                message: 'Notification was already completed',
                notification
            });
        }

        notification.actionTaken = userAction;

        const reminderType = getReminderType(notification);

        // =====================================================
        // NO: SNOOZE ANY REMINDER FOR 20 MINUTES
        // =====================================================

        if (userAction === 'no') {
            const twentyMinutesLater = new Date(
                Date.now() + 20 * 60 * 1000
            );

            notification.status = 'Snoozed';
            notification.snoozedUntil = twentyMinutesLater;

            await notification.save();

            console.log(
                `>>> NOTIFICATION ${notification._id} SNOOZED UNTIL ${twentyMinutesLater.toISOString()} <<<`
            );

            return res.status(200).json({
                success: true,
                message: 'Reminder snoozed for 20 minutes.',
                action: 'no',
                snoozedUntil: twentyMinutesLater,
                notification
            });
        }

        // =====================================================
        // YES: START SLEEP
        // =====================================================

        if (reminderType === 'sleep-start') {
            // Prevent overwriting an already active sleep session.
            const activeSleep = await Activity.findOne({
                userId,
                isSleeping: true
            }).sort({
                sleepStart: -1
            });

            if (activeSleep) {
                notification.status = 'Completed';
                notification.snoozedUntil = null;
                await notification.save();

                return res.status(200).json({
                    success: true,
                    message: 'Sleep tracking is already active.',
                    action: 'yes',
                    isSleeping: true,
                    sleepStartedAt: activeSleep.sleepStart,
                    activity: activeSleep,
                    notification
                });
            }

            const today = getIndiaDate();

            let activity = await Activity.findOne({
                userId,
                date: today
            });

            if (!activity) {
                activity = new Activity({
                    userId,
                    date: today
                });
            }

            const sleepStart = new Date();

            activity.sleepStart = sleepStart;
            activity.sleepEnd = null;
            activity.sleepMinutes = 0;
            activity.isSleeping = true;

            await activity.save();

            notification.status = 'Completed';
            notification.snoozedUntil = null;

            await notification.save();

            console.log(
                `>>> SLEEP STARTED FOR USER ${userId} AT ${sleepStart.toISOString()} <<<`
            );

            return res.status(200).json({
                success: true,
                message: 'Sleep tracking started.',
                action: 'yes',
                isSleeping: true,
                sleepStartedAt: activity.sleepStart,
                activity,
                notification
            });
        }

        // =====================================================
        // YES: END SLEEP / WAKE UP
        // =====================================================

        if (reminderType === 'sleep-end') {
            const activity = await Activity.findOne({
                userId,
                isSleeping: true
            }).sort({
                sleepStart: -1
            });

            if (!activity || !activity.sleepStart) {
                return res.status(400).json({
                    success: false,
                    message: 'No active sleep session was found.',
                    isSleeping: false
                });
            }

            const sleepEnd = new Date();

            const differenceMs =
                sleepEnd.getTime() -
                new Date(activity.sleepStart).getTime();

            if (differenceMs < 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Sleep end time cannot be before sleep start time.'
                });
            }

            const sleepMinutes = Math.round(
                differenceMs / (1000 * 60)
            );

            activity.sleepEnd = sleepEnd;
            activity.sleepMinutes = sleepMinutes;
            activity.isSleeping = false;

            await activity.save();

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
                action: 'yes',
                isSleeping: false,
                sleepStartedAt: activity.sleepStart,
                sleepEndedAt: activity.sleepEnd,
                sleepMinutes: activity.sleepMinutes,
                activity,
                notification
            });
        }

        // =====================================================
        // YES: WATER REMINDER
        // =====================================================

        if (reminderType === 'water') {
            const today = getIndiaDate();

            let activity = await Activity.findOne({
                userId,
                date: today
            });

            if (!activity) {
                activity = new Activity({
                    userId,
                    date: today
                });
            }

            activity.waterLitres = Number(
                (
                    Number(activity.waterLitres || 0) + 0.25
                ).toFixed(2)
            );

            await activity.save();

            notification.status = 'Completed';
            notification.snoozedUntil = null;

            await notification.save();

            return res.status(200).json({
                success: true,
                message: 'Water intake recorded.',
                action: 'yes',
                activity,
                notification
            });
        }

        // =====================================================
        // YES: MEAL REMINDER
        // =====================================================

        if (reminderType === 'meal') {
            const today = getIndiaDate();

            let activity = await Activity.findOne({
                userId,
                date: today
            });

            if (!activity) {
                activity = new Activity({
                    userId,
                    date: today
                });
            }

            activity.mealCount =
                Number(activity.mealCount || 0) + 1;

            activity.calorieIntake =
                Number(activity.calorieIntake || 0) + 500;

            await activity.save();

            notification.status = 'Completed';
            notification.snoozedUntil = null;

            await notification.save();

            return res.status(200).json({
                success: true,
                message: 'Meal recorded.',
                action: 'yes',
                activity,
                notification
            });
        }

        // =====================================================
        // YES: OTHER / GENERAL REMINDERS
        // =====================================================

        notification.status = 'Completed';
        notification.snoozedUntil = null;

        await notification.save();

        return res.status(200).json({
            success: true,
            message: 'Reminder marked as completed.',
            action: 'yes',
            notification
        });

    } catch (err) {
        console.error(
            'Notification response error:',
            err.message
        );

        return res.status(500).json({
            success: false,
            error: 'Server error processing response'
        });
    }
});

// ============================================================
// 5. DELETE NOTIFICATION
// ============================================================

router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const userId = getUserId(req);

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized: User ID missing from token'
            });
        }

        const notification =
            await Notification.findOneAndDelete({
                _id: req.params.id,
                userId
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
