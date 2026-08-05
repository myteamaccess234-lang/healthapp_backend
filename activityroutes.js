const express = require('express');
const router = express.Router();
const Activity = require('../models/activityModel');
const User = require('../models/usermodel');
const authMiddleware = require('../middleware/authmiddleware');

// Helper function to evaluate and unlock achievements
async function evaluateAchievements(userId, activityData) {
    let user = await User.findById(userId);
    if (!user) return;

    if (!user.achievements) user.achievements = {};

    // 1. Logged in & First Day
    user.achievements.loggedIn = true;
    user.achievements.firstDay = true;

    // 2. Hydration Hero (e.g., target >= 3.0 Litres)
    if (activityData.waterLitres >= 3.0) {
        user.achievements.hydrationHero = true;
    }

    // 3. Meal Hero (e.g., mealCount >= 4)
    if (activityData.mealCount >= 4) {
        user.achievements.mealHero = true;
    }

    // 4. 2 Lakh Step Completed (Cumulative lifetime check)
    user.lifetimeSteps = (user.lifetimeSteps || 0) + (activityData.steps || 0);
    if (user.lifetimeSteps >= 200000) {
        user.achievements.twoLakhSteps = true;
    }

    // 5. All Goals Completed
    if (
        activityData.steps >= 10000 &&
        activityData.waterLitres >= 3.0 &&
        activityData.mealCount >= 4 &&
        activityData.caloriesBurned >= 500
    ) {
        user.achievements.allGoalsCompleted = true;
    }

    await user.save();
}

// Save or update daily activity log
router.post('/save', authMiddleware, async (req, res) => {
    try {
        const { date, steps, caloriesBurned, waterLitres, mealCount, calorieIntake } = req.body;
        
        const userId = req.user?.id || req.user?._id || req.user?.userId;

        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized: User ID missing from token" });
        }

        let activity = await Activity.findOne({ userId, date });

        if (activity) {
            activity.steps = steps;
            activity.caloriesBurned = caloriesBurned;
            activity.waterLitres = waterLitres;
            activity.mealCount = mealCount;
            activity.calorieIntake = calorieIntake;
            await activity.save();
        } else {
            activity = new Activity({
                userId,
                date,
                steps,
                caloriesBurned,
                waterLitres,
                mealCount,
                calorieIntake
            });
            await activity.save();
        }

        // Evaluate achievements automatically upon saving activity
        await evaluateAchievements(userId, activity);

        res.status(200).json({ success: true, message: "Activity data saved successfully", activity });
    } catch (err) {
        console.error("Server error in /save activity:", err.message);
        res.status(500).json({ success: false, message: err.message });
    }
});

// Fetch activity history for logged-in user
router.get('/history', authMiddleware, async (req, res) => {
    try {
        const userId = req.user?.id || req.user?._id || req.user?.userId;
        
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized: User ID missing from token" });
        }

        const activities = await Activity.find({ userId }).sort({ createdAt: -1 });
        res.status(200).json(activities);
    } catch (err) {
        console.error("Server error in /history activity:", err.message);
        res.status(500).json({ success: false, message: err.message });
    }
});

// NEW: Handle hydration button clicks from push notifications
router.post('/log-hydration', async (req, res) => {
    try {
        const { action } = req.body;
        console.log("Received push action click:", action);

        if (action === 'yes-water') {
            const today = new Date().toISOString().split('T')[0];
            let activity = await Activity.findOne({ date: today }).sort({ createdAt: -1 });
            if (activity) {
                activity.waterLitres = (activity.waterLitres || 0) + 0.5;
                await activity.save();

                // Evaluate achievements after updating hydration
                await evaluateAchievements(activity.userId, activity);
            }
        }

        res.status(200).json({ success: true, message: `Hydration action '${action}' processed successfully` });
    } catch (err) {
        console.error("Server error in /log-hydration:", err.message);
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;