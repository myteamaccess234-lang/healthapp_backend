const express = require('express');
const router = express.Router();

// Direct imports matching your root directory layout
const Activity = require('./activityModel');
const User = require('./usermodel');
const authMiddleware = require('./authMiddleware');

/**
 * Helper function to evaluate and unlock achievements cleanly
 */
async function evaluateAchievements(userId, activityData, stepDelta = 0) {
    try {
        let user = await User.findById(userId);
        if (!user) return;

        if (!user.achievements) user.achievements = {};

        // 1. Logged in & First Day
        user.achievements.loggedIn = true;
        user.achievements.firstDay = true;

        // 2. Hydration Hero (target >= 3.0 Litres)
        if (activityData.waterLitres >= 3.0) {
            user.achievements.hydrationHero = true;
        }

        // 3. Meal Hero (mealCount >= 4)
        if (activityData.mealCount >= 4) {
            user.achievements.mealHero = true;
        }

        // 4. 2 Lakh Step Completed (Cumulative lifetime check using step delta)
        if (stepDelta > 0) {
            user.lifetimeSteps = (user.lifetimeSteps || 0) + stepDelta;
        }
        
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
    } catch (err) {
        console.error("Error evaluating achievements:", err.message);
    }
}

// ==============================================================================
// ROUTES
// ==============================================================================

// 1. Save or update daily activity log (INCLUDES BMI, HEIGHT, WEIGHT, STEPS)
router.post('/save', authMiddleware, async (req, res) => {
    try {
        const { 
            date, 
            steps, 
            caloriesBurned, 
            waterLitres, 
            mealCount, 
            calorieIntake,
            bmi,     // TRACKS BMI
            height,  // TRACKS HEIGHT
            weight   // TRACKS WEIGHT
        } = req.body;
        
        const userId = req.user?.id || req.user?._id || req.user?.userId;

        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized: User ID missing from token" });
        }

        const currentDate = date || new Date().toISOString().split('T')[0];
        let activity = await Activity.findOne({ userId, date: currentDate });
        let stepDelta = 0;

        if (activity) {
            if (steps !== undefined) {
                const oldSteps = activity.steps || 0;
                stepDelta = Math.max(0, steps - oldSteps); // Track only incremental new steps
                activity.steps = steps;
            }
            if (caloriesBurned !== undefined) activity.caloriesBurned = caloriesBurned;
            if (waterLitres !== undefined) activity.waterLitres = waterLitres;
            if (mealCount !== undefined) activity.mealCount = mealCount;
            if (calorieIntake !== undefined) activity.calorieIntake = calorieIntake;
            
            // Save BMI metrics if provided
            if (bmi !== undefined) activity.bmi = bmi;
            if (height !== undefined) activity.height = height;
            if (weight !== undefined) activity.weight = weight;

            await activity.save();
        } else {
            stepDelta = steps || 0;
            activity = new Activity({
                userId,
                date: currentDate,
                steps: steps || 0,
                caloriesBurned: caloriesBurned || 0,
                waterLitres: waterLitres || 0,
                mealCount: mealCount || 0,
                calorieIntake: calorieIntake || 0,
                bmi,
                height,
                weight
            });
            await activity.save();
        }

        // Evaluate achievements automatically with incremental step delta
        await evaluateAchievements(userId, activity, stepDelta);

        res.status(200).json({ 
            success: true, 
            message: "Activity and BMI recorded successfully", 
            activity 
        });
    } catch (err) {
        console.error("Server error in /save activity:", err.message);
        res.status(500).json({ success: false, message: err.message });
    }
});

// 2. Specialized Route: Native Background Step Sync (Screen-Off Hardware Pedometer Sync)
router.post('/sync-steps', authMiddleware, async (req, res) => {
    try {
        const { steps, caloriesBurned, date } = req.body;
        const userId = req.user?.id || req.user?._id || req.user?.userId;

        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized: User ID missing from token" });
        }

        if (steps === undefined || steps === null) {
            return res.status(400).json({ success: false, message: "Steps payload is required" });
        }

        const currentDate = date || new Date().toISOString().split('T')[0];
        let activity = await Activity.findOne({ userId, date: currentDate });
        let stepDelta = 0;

        if (activity) {
            const oldSteps = activity.steps || 0;
            // Only update if step count from hardware pedometer is greater than current DB steps
            if (steps > oldSteps) {
                stepDelta = steps - oldSteps;
                activity.steps = steps;
                
                // Auto-calculate or update calories burned if provided
                if (caloriesBurned !== undefined) {
                    activity.caloriesBurned = caloriesBurned;
                } else {
                    activity.caloriesBurned = Math.floor(steps * 0.04);
                }

                await activity.save();
            }
        } else {
            stepDelta = steps;
            activity = new Activity({
                userId,
                date: currentDate,
                steps: steps,
                caloriesBurned: caloriesBurned !== undefined ? caloriesBurned : Math.floor(steps * 0.04)
            });
            await activity.save();
        }

        // Increment lifetime steps and re-check step achievements
        if (stepDelta > 0) {
            await evaluateAchievements(userId, activity, stepDelta);
        }

        res.status(200).json({
            success: true,
            message: "Background steps synced successfully",
            activity: {
                date: activity.date,
                steps: activity.steps,
                caloriesBurned: activity.caloriesBurned
            }
        });
    } catch (err) {
        console.error("Server error in /sync-steps:", err.message);
        res.status(500).json({ success: false, message: err.message });
    }
});

// 3. Fetch activity history for logged-in user
router.get('/history', authMiddleware, async (req, res) => {
    try {
        const userId = req.user?.id || req.user?._id || req.user?.userId;
        
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized: User ID missing from token" });
        }

        const activities = await Activity.find({ userId }).sort({ date: -1 });
        res.status(200).json(activities);
    } catch (err) {
        console.error("Server error in /history activity:", err.message);
        res.status(500).json({ success: false, message: err.message });
    }
});

// 4. Dual Quick-Actions from Push Notifications (Water & Food)
router.post('/log-hydration', authMiddleware, async (req, res) => {
    try {
        const { action } = req.body;
        const userId = req.user?.id || req.user?._id || req.user?.userId;

        console.log(`Received push action click '${action}' for User: ${userId}`);

        const today = new Date().toISOString().split('T')[0];
        
        // Find or create today's activity entry for THIS user
        let activity = await Activity.findOne({ userId, date: today });
        if (!activity) {
            activity = new Activity({ userId, date: today });
        }

        if (action === 'yes-water') {
            const updatedWater = (activity.waterLitres || 0) + 0.5;
            activity.waterLitres = Math.round(updatedWater * 100) / 100; // Round to 2 decimal places
            await activity.save();
            await evaluateAchievements(userId, activity);
        } else if (action === 'yes-food' || action === 'log-meal') {
            activity.mealCount = (activity.mealCount || 0) + 1; // Add 1 meal
            await activity.save();
            await evaluateAchievements(userId, activity);
        }

        res.status(200).json({ 
            success: true, 
            message: `Quick-action '${action}' logged successfully!`,
            activity 
        });
    } catch (err) {
        console.error("Server error in /log-hydration:", err.message);
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;
