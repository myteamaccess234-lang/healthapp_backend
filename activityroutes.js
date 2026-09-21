const express = require('express');
const router = express.Router();

// Direct imports matching your root directory layout
const Activity = require('./activityModel');
const User = require('./usermodel');
const authMiddleware = require('./authMiddleware');

/**
 * ============================================================
 * HELPER: Get current date in India timezone
 * Returns YYYY-MM-DD
 * ============================================================
 */
function getIndiaDate() {
    return new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Asia/Kolkata',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    }).format(new Date());
}

/**
 * ============================================================
 * HELPER: Get User ID from JWT
 * ============================================================
 */
function getUserId(req) {
    return (
        req.user?.id ||
        req.user?._id ||
        req.user?.userId
    );
}

/**
 * ============================================================
 * HELPER: Evaluate and unlock achievements
 * ============================================================
 */
async function evaluateAchievements(
    userId,
    activityData,
    stepDelta = 0
) {
    try {
        const user = await User.findById(userId);

        if (!user) {
            console.error(
                'Achievement check failed: User not found'
            );
            return;
        }

        // Make sure achievements object exists
        if (!user.achievements) {
            user.achievements = {};
        }

        // ------------------------------------------------------
        // 1. Logged In / First Day
        // ------------------------------------------------------
        user.achievements.loggedIn = true;
        user.achievements.firstDay = true;

        // ------------------------------------------------------
        // 2. Hydration Hero
        // Target: 3 Litres
        // ------------------------------------------------------
        if (
            Number(activityData.waterLitres || 0) >= 3.0
        ) {
            user.achievements.hydrationHero = true;
        }

        // ------------------------------------------------------
        // 3. Meal Hero
        // Target: 4 meals
        // ------------------------------------------------------
        if (
            Number(activityData.mealCount || 0) >= 4
        ) {
            user.achievements.mealHero = true;
        }

        // ------------------------------------------------------
        // 4. Lifetime Steps
        // Add ONLY the new step difference.
        // Prevents duplicate counting.
        // ------------------------------------------------------
        if (stepDelta > 0) {
            user.lifetimeSteps =
                Number(user.lifetimeSteps || 0) +
                Number(stepDelta);
        }

        // ------------------------------------------------------
        // 5. 2 Lakh Steps Achievement
        // ------------------------------------------------------
        if (
            Number(user.lifetimeSteps || 0) >= 200000
        ) {
            user.achievements.twoLakhSteps = true;
        }

        // ------------------------------------------------------
        // 6. All Daily Goals Completed
        // ------------------------------------------------------
        if (
            Number(activityData.steps || 0) >= 10000 &&
            Number(activityData.waterLitres || 0) >= 3.0 &&
            Number(activityData.mealCount || 0) >= 4 &&
            Number(activityData.caloriesBurned || 0) >= 500
        ) {
            user.achievements.allGoalsCompleted = true;
        }

        await user.save();

    } catch (err) {
        console.error(
            'Error evaluating achievements:',
            err.message
        );
    }
}

// ============================================================================
// 1. SAVE / UPDATE DAILY ACTIVITY
// Includes:
// BMI
// Height
// Weight
// Steps
// Sleep
// Water
// Meals
// Calories
// ============================================================================

router.post(
    '/save',
    authMiddleware,
    async (req, res) => {
        try {
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

            const userId = getUserId(req);

            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message:
                        'Unauthorized: User ID missing from token'
                });
            }

            // Use supplied date only if provided.
            // Otherwise use India local date.
            const currentDate =
                date || getIndiaDate();

            // Find today's activity
            let activity = await Activity.findOne({
                userId,
                date: currentDate
            });

            let stepDelta = 0;

            // =================================================================
            // EXISTING ACTIVITY -> UPDATE
            // =================================================================

            if (activity) {

                // -------------------------------------------------------------
                // STEPS
                // Only count NEW steps.
                // If incoming steps are lower, don't reduce DB count.
                // -------------------------------------------------------------
                if (steps !== undefined) {

                    const incomingSteps =
                        Number(steps);

                    const oldSteps =
                        Number(activity.steps || 0);

                    if (
                        Number.isFinite(incomingSteps) &&
                        incomingSteps > oldSteps
                    ) {
                        stepDelta =
                            incomingSteps - oldSteps;

                        activity.steps =
                            incomingSteps;
                    }
                }

                // -------------------------------------------------------------
                // CALORIES
                // -------------------------------------------------------------
                if (
                    caloriesBurned !== undefined
                ) {
                    activity.caloriesBurned =
                        Number(caloriesBurned) || 0;
                }

                // -------------------------------------------------------------
                // WATER
                // -------------------------------------------------------------
                if (
                    waterLitres !== undefined
                ) {
                    activity.waterLitres =
                        Number(waterLitres) || 0;
                }

                // -------------------------------------------------------------
                // MEALS
                // -------------------------------------------------------------
                if (
                    mealCount !== undefined
                ) {
                    activity.mealCount =
                        Number(mealCount) || 0;
                }

                // -------------------------------------------------------------
                // CALORIE INTAKE
                // -------------------------------------------------------------
                if (
                    calorieIntake !== undefined
                ) {
                    activity.calorieIntake =
                        Number(calorieIntake) || 0;
                }

                // -------------------------------------------------------------
                // SLEEP
                // -------------------------------------------------------------
                if (
                    sleepMinutes !== undefined
                ) {
                    activity.sleepMinutes =
                        Number(sleepMinutes) || 0;
                }

                // -------------------------------------------------------------
                // BMI
                // -------------------------------------------------------------
                if (bmi !== undefined) {
                    activity.bmi =
                        Number(bmi);
                }

                // -------------------------------------------------------------
                // HEIGHT
                // -------------------------------------------------------------
                if (height !== undefined) {
                    activity.height =
                        Number(height);
                }

                // -------------------------------------------------------------
                // WEIGHT
                // -------------------------------------------------------------
                if (weight !== undefined) {
                    activity.weight =
                        Number(weight);
                }

                await activity.save();

            } else {

                // =================================================================
                // NO ACTIVITY FOR THIS DATE -> CREATE NEW RECORD
                // =================================================================

                const initialSteps =
                    steps !== undefined
                        ? Math.max(0, Number(steps) || 0)
                        : 0;

                stepDelta = initialSteps;

                activity = new Activity({
                    userId,
                    date: currentDate,

                    steps: initialSteps,

                    caloriesBurned:
                        caloriesBurned !== undefined
                            ? Number(caloriesBurned) || 0
                            : 0,

                    waterLitres:
                        waterLitres !== undefined
                            ? Number(waterLitres) || 0
                            : 0,

                    mealCount:
                        mealCount !== undefined
                            ? Number(mealCount) || 0
                            : 0,

                    calorieIntake:
                        calorieIntake !== undefined
                            ? Number(calorieIntake) || 0
                            : 0,

                    sleepMinutes:
                        sleepMinutes !== undefined
                            ? Number(sleepMinutes) || 0
                            : 0,

                    bmi:
                        bmi !== undefined
                            ? Number(bmi)
                            : null,

                    height:
                        height !== undefined
                            ? Number(height)
                            : null,

                    weight:
                        weight !== undefined
                            ? Number(weight)
                            : null
                });

                await activity.save();
            }

            // =================================================================
            // ACHIEVEMENTS
            // Only NEW step difference is added to lifetimeSteps.
            // =================================================================

            await evaluateAchievements(
                userId,
                activity,
                stepDelta
            );

            return res.status(200).json({
                success: true,
                message:
                    'Activity, BMI and sleep data recorded successfully',
                activity
            });

        } catch (err) {

            console.error(
                'Server error in /save activity:',
                err.message
            );

            return res.status(500).json({
                success: false,
                message: err.message
            });
        }
    }
);

// ============================================================================
// 2. NATIVE BACKGROUND STEP SYNC
// Used by Android native pedometer / screen-off tracking
// ============================================================================

router.post(
    '/sync-steps',
    authMiddleware,
    async (req, res) => {
        try {
            const {
                steps,
                caloriesBurned,
                date
            } = req.body;

            const userId = getUserId(req);

            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message:
                        'Unauthorized: User ID missing from token'
                });
            }

            // ---------------------------------------------------------------
            // Validate steps
            // ---------------------------------------------------------------

            if (
                steps === undefined ||
                steps === null
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        'Steps payload is required'
                });
            }

            const incomingSteps =
                Number(steps);

            if (
                !Number.isFinite(incomingSteps) ||
                incomingSteps < 0
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        'Steps must be a valid non-negative number'
                });
            }

            // Use India date
            const currentDate =
                date || getIndiaDate();

            // Find today's activity
            let activity = await Activity.findOne({
                userId,
                date: currentDate
            });

            let stepDelta = 0;

            // =================================================================
            // EXISTING ACTIVITY
            // =================================================================

            if (activity) {

                const oldSteps =
                    Number(activity.steps || 0);

                // -------------------------------------------------------------
                // Only accept higher hardware step count.
                // This prevents steps from going backwards.
                // -------------------------------------------------------------

                if (incomingSteps > oldSteps) {

                    stepDelta =
                        incomingSteps - oldSteps;

                    activity.steps =
                        incomingSteps;

                    // ---------------------------------------------------------
                    // Calories
                    // Use supplied calories if available.
                    // Otherwise use basic step estimate.
                    // ---------------------------------------------------------

                    if (
                        caloriesBurned !== undefined
                    ) {
                        activity.caloriesBurned =
                            Number(caloriesBurned) || 0;
                    } else {
                        activity.caloriesBurned =
                            Math.floor(
                                incomingSteps * 0.04
                            );
                    }

                    await activity.save();
                }

            } else {

                // =================================================================
                // CREATE TODAY'S ACTIVITY
                // =================================================================

                stepDelta =
                    incomingSteps;

                activity = new Activity({
                    userId,
                    date: currentDate,

                    steps: incomingSteps,

                    caloriesBurned:
                        caloriesBurned !== undefined
                            ? Number(caloriesBurned) || 0
                            : Math.floor(
                                incomingSteps * 0.04
                            )
                });

                await activity.save();
            }

            // =================================================================
            // ACHIEVEMENT CHECK
            // =================================================================

            if (stepDelta > 0) {

                await evaluateAchievements(
                    userId,
                    activity,
                    stepDelta
                );
            }

            return res.status(200).json({
                success: true,
                message:
                    'Background steps synced successfully',

                activity: {
                    date: activity.date,
                    steps: activity.steps,
                    caloriesBurned:
                        activity.caloriesBurned
                }
            });

        } catch (err) {

            console.error(
                'Server error in /sync-steps:',
                err.message
            );

            return res.status(500).json({
                success: false,
                message: err.message
            });
        }
    }
);

// ============================================================================
// 3. FETCH ACTIVITY HISTORY
// ============================================================================

router.get(
    '/history',
    authMiddleware,
    async (req, res) => {
        try {

            const userId = getUserId(req);

            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message:
                        'Unauthorized: User ID missing from token'
                });
            }

            const activities =
                await Activity
                    .find({ userId })
                    .sort({ date: -1 });

            return res.status(200).json(
                activities
            );

        } catch (err) {

            console.error(
                'Server error in /history activity:',
                err.message
            );

            return res.status(500).json({
                success: false,
                message: err.message
            });
        }
    }
);

// ============================================================================
// 4. PUSH NOTIFICATION QUICK ACTIONS
// Water + Food
// ============================================================================

router.post(
    '/log-hydration',
    authMiddleware,
    async (req, res) => {
        try {

            const { action } = req.body;

            const userId = getUserId(req);

            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message:
                        'Unauthorized: User ID missing from token'
                });
            }

            console.log(
                `Received push action click '${action}' for User: ${userId}`
            );

            // India local date
            const today =
                getIndiaDate();

            // Find today's activity
            let activity =
                await Activity.findOne({
                    userId,
                    date: today
                });

            // Create if doesn't exist
            if (!activity) {

                activity = new Activity({
                    userId,
                    date: today
                });
            }

            // =================================================================
            // WATER
            // =================================================================

            if (action === 'yes-water') {

                const updatedWater =
                    Number(
                        activity.waterLitres || 0
                    ) + 0.5;

                activity.waterLitres =
                    Math.round(
                        updatedWater * 100
                    ) / 100;

                await activity.save();

                await evaluateAchievements(
                    userId,
                    activity
                );

            }

            // =================================================================
            // FOOD / MEAL
            // =================================================================

            else if (
                action === 'yes-food' ||
                action === 'log-meal'
            ) {

                activity.mealCount =
                    Number(
                        activity.mealCount || 0
                    ) + 1;

                await activity.save();

                await evaluateAchievements(
                    userId,
                    activity
                );
            }

            // =================================================================
            // UNKNOWN ACTION
            // =================================================================

            else {

                return res.status(400).json({
                    success: false,
                    message:
                        'Invalid quick-action'
                });
            }

            return res.status(200).json({
                success: true,
                message:
                    `Quick-action '${action}' logged successfully!`,
                activity
            });

        } catch (err) {

            console.error(
                'Server error in /log-hydration:',
                err.message
            );

            return res.status(500).json({
                success: false,
                message: err.message
            });
        }
    }
);

// ============================================================================
// EXPORT ROUTER
// ============================================================================

module.exports = router;
