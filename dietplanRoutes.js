
const express = require('express');
const router = express.Router();
const DietPlan = require('./dietplanModel');

// ============================================================
// GET DIET PLAN
// Supports:
// 1. Exact age match
// 2. Nearest available age plan
// 3. BMI category
//
// Example:
// /api/dietplans?age=51&category=underweight
// /api/dietplans?age=25&category=normal
// ============================================================

router.get('/', async (req, res) => {
    try {
        let { age, category } = req.query;

        // --------------------------------------------------------
        // Validate age
        // --------------------------------------------------------

        const numericAge = Number(age);

        if (!age || !Number.isFinite(numericAge)) {
            return res.status(400).json({
                success: false,
                error: 'Valid age is required.'
            });
        }

        if (numericAge < 1 || numericAge > 120) {
            return res.status(400).json({
                success: false,
                error: 'Age must be between 1 and 120.'
            });
        }

        // --------------------------------------------------------
        // Normalize category
        // --------------------------------------------------------

        category = String(category || '')
            .trim()
            .toLowerCase();

        const validCategories = [
            'underweight',
            'normal',
            'overweight',
            'obese'
        ];

        if (!validCategories.includes(category)) {
            return res.status(400).json({
                success: false,
                error:
                    'Invalid BMI category. Use underweight, normal, overweight, or obese.'
            });
        }

        // --------------------------------------------------------
        // Find exact age first
        // --------------------------------------------------------

        let plan = await DietPlan.findOne({
            age: numericAge
        });

        // --------------------------------------------------------
        // If exact age does not exist,
        // find the closest available age
        // --------------------------------------------------------

        if (!plan) {

            const lowerPlan = await DietPlan.findOne({
                age: { $lte: numericAge }
            }).sort({ age: -1 });

            const higherPlan = await DietPlan.findOne({
                age: { $gte: numericAge }
            }).sort({ age: 1 });

            if (!lowerPlan && !higherPlan) {
                return res.status(404).json({
                    success: false,
                    error: 'No diet plans are available.'
                });
            }

            if (!lowerPlan) {
                plan = higherPlan;
            } else if (!higherPlan) {
                plan = lowerPlan;
            } else {

                const lowerDifference =
                    Math.abs(numericAge - lowerPlan.age);

                const higherDifference =
                    Math.abs(higherPlan.age - numericAge);

                plan =
                    lowerDifference <= higherDifference
                        ? lowerPlan
                        : higherPlan;
            }
        }

        // --------------------------------------------------------
        // Get category data
        // --------------------------------------------------------

        let categoryData = plan.categories[category];

        // --------------------------------------------------------
        // Backward compatibility:
        // If "obese" does not exist, use overweight plan.
        // --------------------------------------------------------

        if (!categoryData && category === 'obese') {
            categoryData = plan.categories.overweight;
        }

        if (!categoryData) {
            return res.status(404).json({
                success: false,
                error:
                    `Diet plan for BMI category "${category}" is not available.`
            });
        }

        // --------------------------------------------------------
        // Return response
        // --------------------------------------------------------

        return res.status(200).json({
            success: true,

            requestedAge: numericAge,

            planAge: plan.age,

            category,

            dietPlan: categoryData
        });

    } catch (err) {

        console.error(
            'Diet plan fetch error:',
            err
        );

        return res.status(500).json({
            success: false,
            error: 'Server error while fetching diet plan.'
        });
    }
});

module.exports = router;
