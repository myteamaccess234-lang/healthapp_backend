const express = require('express');
const router = express.Router();

const Activity = require('./activityModel');
const User = require('./usermodel');
const authMiddleware = require('./authMiddleware');

// =========================================================
// DATE HELPER — ALWAYS INDIA DATE (YYYY-MM-DD)
// =========================================================
function getIndiaDate() {
    return new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Asia/Kolkata',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    }).format(new Date());
}

// =========================================================
// USER ID HELPER
// =========================================================
function getUserId(req) {
    return req.user?.id || req.user?._id || req.user?.userId || null;
}

// =========================================================
// SAFE NUMBER
// =========================================================
function safeNumber(value, fallback = 0) {
    const number = Number(value);

    if (!Number.isFinite(number)) {
        return fallback;
    }

    return number;
}

// =========================================================
// DATE VALIDATION
// =========================================================
function normalizeDate(date) {
    if (!date) {
        return getIndiaDate();
    }

    const value = String(date).trim();

    // Already correct YYYY-MM-DD
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        return value;
    }

    // Handle common formats such as:
    // 9/21/2026
    // 21/9/2026
    const slashMatch = value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);

    if (slashMatch) {
        const first = Number(slashMatch[1]);
        const second = Number(slashMatch[2]);
        const year = Number(slashMatch[3]);

        // If first number > 12, assume DD/MM/YYYY
        if (first > 12) {
            return `${year}-${String(second).padStart(2, '0')}-${String(first).padStart(2, '0')}`;
        }

        // Otherwise assume MM/DD/YYYY
        return `${year}-${String(first).padStart(2, '0')}-${String(second).padStart(2, '0')}`;
    }

    // Invalid format → use today's India date
    return getIndiaDate();
}

// =========================================================
// ACHIEVEMENT EVALUATION
// =========================================================
async function evaluateAchievements(userId, activityData, stepDelta = 0) {
    try {
        const user = await User.findById(userId);

        if (!user) {
            return;
        }

        if (!user.achievements) {
            user.achievements = {};
        }

        // Login achievement
        user.achievements.loggedIn = true;

        // First day achievement
        user.achievements.firstDay = true;

        // =====================================================
        // HYDRATION HERO
        // =====================================================
        if (safeNumber(activityData.waterLitres) >= 3) {
            user.achievements.hydrationHero = true;
        }

        // =====================================================
        // MEAL HERO
        // =====================================================
        if (safeNumber(activityData.mealCount) >= 4) {
            user.achievements.mealHero = true;
        }

        // =====================================================
        // LIFETIME STEPS
        // =====================================================
        const positiveStepDelta = Math.max(
            0,
            Math.floor(safeNumber(stepDelta))
        );

        if (positiveStepDelta > 0) {
            const currentLifetimeSteps =
                safeNumber(user.achievements.lifetimeSteps);

            user.achievements.lifetimeSteps =
                currentLifetimeSteps + positiveStepDelta;
        }

        // =====================================================
        // 2 LAKH STEPS
        // =====================================================
        if (
            safeNumber(user.achievements.lifetimeSteps) >= 200000
        ) {
            user.achievements.twoLakhSteps = true;
        }

        // =====================================================
        // ALL DAILY GOALS
        // =====================================================
        const dailySteps = safeNumber(activityData.steps);
        const dailyWater = safeNumber(activityData.waterLitres);
        const dailyMeals = safeNumber(activityData.mealCount);
        const dailyCalories = safeNumber(activityData.caloriesBurned);

        if (
            dailySteps >= 10000 &&
            dailyWater >= 3 &&
            dailyMeals >= 4 &&
            dailyCalories >= 500
        ) {
            user.achievements.allGoalsCompleted = true;
        }

        await user.save();

    } catch (error) {
        console.error(
            'Achievement evaluation error:',
            error.message
        );
    }
}

// =========================================================
// POST /api/activity/save
// =========================================================
router.post('/save', authMiddleware, async (req, res) => {
    try {
        const userId = getUserId(req);

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'User authentication required.'
            });
        }

        const {
            date,
            steps,
            caloriesBurned,
            waterLitres,
            mealCount,
            calorieIntake,
            sleepMinutes,
            bmi,
            height,
            weight
        } = req.body;

        const currentDate = normalizeDate(date);

        // =====================================================
        // CLEAN INPUT VALUES
        // =====================================================
        const incomingSteps = Math.max(
            0,
            Math.floor(safeNumber(steps))
        );

        const incomingCalories = Math.max(
            0,
            safeNumber(caloriesBurned)
        );

        const incomingWater = Math.max(
            0,
            safeNumber(waterLitres)
        );

        const incomingMeals = Math.max(
            0,
            Math.floor(safeNumber(mealCount))
        );

        const incomingCalorieIntake = Math.max(
            0,
            safeNumber(calorieIntake)
        );

        const incomingSleep = Math.max(
            0,
            Math.floor(safeNumber(sleepMinutes))
        );

        // =====================================================
        // FIND USER + DATE RECORD
        // =====================================================
        let activity = await Activity.findOne({
            userId: userId,
            date: currentDate
        });

        let stepDelta = 0;

        // =====================================================
        // UPDATE EXISTING RECORD
        // =====================================================
        if (activity) {

            const oldSteps = Math.max(
                0,
                safeNumber(activity.steps)
            );

            // Steps can ONLY increase
            if (incomingSteps > oldSteps) {
                stepDelta = incomingSteps - oldSteps;
                activity.steps = incomingSteps;
            }

            // Update other values only when valid data is supplied
            if (caloriesBurned !== undefined && caloriesBurned !== null) {
                activity.caloriesBurned = incomingCalories;
            }

            if (waterLitres !== undefined && waterLitres !== null) {
                activity.waterLitres = incomingWater;
            }

            if (mealCount !== undefined && mealCount !== null) {
                activity.mealCount = incomingMeals;
            }

            if (
                calorieIntake !== undefined &&
                calorieIntake !== null
            ) {
                activity.calorieIntake = incomingCalorieIntake;
            }

            if (
                sleepMinutes !== undefined &&
                sleepMinutes !== null
            ) {
                activity.sleepMinutes = incomingSleep;
            }

            if (bmi !== undefined && bmi !== null && bmi !== '') {
                const bmiValue = safeNumber(bmi, NaN);

                if (Number.isFinite(bmiValue)) {
                    activity.bmi = bmiValue;
                }
            }

            if (height !== undefined && height !== null && height !== '') {
                const heightValue = safeNumber(height, NaN);

                if (Number.isFinite(heightValue)) {
                    activity.height = heightValue;
                }
            }

            if (weight !== undefined && weight !== null && weight !== '') {
                const weightValue = safeNumber(weight, NaN);

                if (Number.isFinite(weightValue)) {
                    activity.weight = weightValue;
                }
            }

            await activity.save();

        } else {

            // =================================================
            // CREATE NEW USER-DATE RECORD
            // =================================================
            stepDelta = incomingSteps;

            activity = new Activity({
                userId: userId,
                date: currentDate,
                steps: incomingSteps,
                caloriesBurned: incomingCalories,
                waterLitres: incomingWater,
                mealCount: incomingMeals,
                calorieIntake: incomingCalorieIntake,
                sleepMinutes: incomingSleep,
                bmi:
                    bmi !== undefined && bmi !== null && bmi !== ''
                        ? safeNumber(bmi, null)
                        : null,
                height:
                    height !== undefined &&
                    height !== null &&
                    height !== ''
                        ? safeNumber(height, null)
                        : null,
                weight:
                    weight !== undefined &&
                    weight !== null &&
                    weight !== ''
                        ? safeNumber(weight, null)
                        : null
            });

            await activity.save();
        }

        // =====================================================
        // ACHIEVEMENTS
        // =====================================================
        await evaluateAchievements(
            userId,
            activity,
            stepDelta
        );

        return res.status(200).json({
            success: true,
            message: 'Activity saved successfully.',
            activity: activity
        });

    } catch (error) {

        console.error(
            'Activity save error:',
            error
        );

        // Duplicate user/date protection
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: 'Activity already exists for this user and date.'
            });
        }

        return res.status(500).json({
            success: false,
            message: 'Failed to save activity.',
            error: error.message
        });
    }
});

// =========================================================
// POST /api/activity/sync-steps
// =========================================================
router.post('/sync-steps', authMiddleware, async (req, res) => {
    try {
        const userId = getUserId(req);

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'User authentication required.'
            });
        }

        const {
            steps,
            caloriesBurned,
            date
        } = req.body;

        const incomingSteps = Math.max(
            0,
            Math.floor(safeNumber(steps))
        );

        if (!Number.isFinite(incomingSteps)) {
            return res.status(400).json({
                success: false,
                message: 'Valid steps value is required.'
            });
        }

        const currentDate = normalizeDate(date);

        let activity = await Activity.findOne({
            userId: userId,
            date: currentDate
        });

        let stepDelta = 0;

        // =====================================================
        // EXISTING RECORD
        // =====================================================
        if (activity) {

            const oldSteps = Math.max(
                0,
                safeNumber(activity.steps)
            );

            // Never allow steps to decrease
            if (incomingSteps > oldSteps) {

                stepDelta = incomingSteps - oldSteps;

                activity.steps = incomingSteps;

                if (
                    caloriesBurned !== undefined &&
                    caloriesBurned !== null
                ) {
                    activity.caloriesBurned = Math.max(
                        0,
                        safeNumber(caloriesBurned)
                    );
                } else {
                    activity.caloriesBurned =
                        Math.floor(incomingSteps * 0.04);
                }

                await activity.save();
            }

        } else {

            // =================================================
            // CREATE NEW RECORD
            // =================================================
            const calculatedCalories =
                caloriesBurned !== undefined &&
                caloriesBurned !== null
                    ? Math.max(0, safeNumber(caloriesBurned))
                    : Math.floor(incomingSteps * 0.04);

            activity = new Activity({
                userId: userId,
                date: currentDate,
                steps: incomingSteps,
                caloriesBurned: calculatedCalories
            });

            await activity.save();

            stepDelta = incomingSteps;
        }

        // =====================================================
        // ACHIEVEMENTS ONLY FOR NEW STEPS
        // =====================================================
        if (stepDelta > 0) {
            await evaluateAchievements(
                userId,
                activity,
                stepDelta
            );
        }

        return res.status(200).json({
            success: true,
            message: 'Steps synced successfully.',
            activity: activity
        });

    } catch (error) {

        console.error(
            'Step sync error:',
            error
        );

        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: 'Activity already exists for this user and date.'
            });
        }

        return res.status(500).json({
            success: false,
            message: 'Failed to sync steps.',
            error: error.message
        });
    }
});

// =========================================================
// GET /api/activity/history
// =========================================================
router.get('/history', authMiddleware, async (req, res) => {
    try {
        const userId = getUserId(req);

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'User authentication required.'
            });
        }

        const activities = await Activity.find({
            userId: userId
        })
            .sort({
                date: -1,
                createdAt: -1
            });

        return res.status(200).json({
            success: true,
            history: activities
        });

    } catch (error) {

        console.error(
            'Activity history error:',
            error
        );

        return res.status(500).json({
            success: false,
            message: 'Failed to fetch activity history.',
            error: error.message
        });
    }
});

// =========================================================
// POST /api/activity/log-hydration
// =========================================================
router.post('/log-hydration', authMiddleware, async (req, res) => {
    try {
        const userId = getUserId(req);

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'User authentication required.'
            });
        }

        const {
            action,
            date
        } = req.body;

        const currentDate = normalizeDate(date);

        let activity = await Activity.findOne({
            userId: userId,
            date: currentDate
        });

        // =====================================================
        // CREATE TODAY'S RECORD IF NEEDED
        // =====================================================
        if (!activity) {
            activity = new Activity({
                userId: userId,
                date: currentDate
            });
        }

        // =====================================================
        // WATER
        // =====================================================
        if (action === 'yes-water') {

            activity.waterLitres =
                Math.max(
                    0,
                    safeNumber(activity.waterLitres)
                ) + 0.5;
        }

        // =====================================================
        // FOOD / MEAL
        // =====================================================
        else if (
            action === 'yes-food' ||
            action === 'log-meal'
        ) {

            activity.mealCount =
                Math.max(
                    0,
                    Math.floor(
                        safeNumber(activity.mealCount)
                    )
                ) + 1;
        }

        else {
            return res.status(400).json({
                success: false,
                message: 'Invalid hydration action.'
            });
        }

        await activity.save();

        await evaluateAchievements(
            userId,
            activity,
            0
        );

        return res.status(200).json({
            success: true,
            message: 'Activity updated successfully.',
            activity: activity
        });

    } catch (error) {

        console.error(
            'Hydration logging error:',
            error
        );

        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: 'Activity already exists for this user and date.'
            });
        }

        return res.status(500).json({
            success: false,
            message: 'Failed to update activity.',
            error: error.message
        });
    }
});

// =========================================================
// EXPORT
// =========================================================
module.exports = router;
