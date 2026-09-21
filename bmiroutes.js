const express = require('express');
const router = express.Router();

const BmiRecord = require('./bmimodel');
const verifyToken = require('./authMiddleware');

// ---------------------------------------------------------
// BMI CATEGORY
// ---------------------------------------------------------

const getBmiCategory = (bmi) => {
    if (bmi < 18.5) return 'Underweight';
    if (bmi < 25.0) return 'Normal weight';
    if (bmi < 30.0) return 'Overweight';
    return 'Obese';
};

// ---------------------------------------------------------
// INDIA DATE - YYYY-MM-DD
// ---------------------------------------------------------

const getIndiaDate = () => {
    return new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Asia/Kolkata',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    }).format(new Date());
};

// ---------------------------------------------------------
// DATE VALIDATION
// ---------------------------------------------------------

const normalizeDate = (value) => {

    if (!value) {
        return getIndiaDate();
    }

    const dateString = String(value).trim();

    // Accept only YYYY-MM-DD
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {

        const [year, month, day] =
            dateString.split('-').map(Number);

        const testDate =
            new Date(Date.UTC(year, month - 1, day));

        if (
            testDate.getUTCFullYear() === year &&
            testDate.getUTCMonth() === month - 1 &&
            testDate.getUTCDate() === day
        ) {
            return dateString;
        }
    }

    // Invalid date → always use current India date
    return getIndiaDate();
};

// ---------------------------------------------------------
// GET USER ID FROM JWT
// ---------------------------------------------------------

const getUserId = (req) => {

    return (
        req.user?.id ||
        req.user?._id ||
        req.user?.userId ||
        null
    );
};

// ---------------------------------------------------------
// SAVE BMI
// ---------------------------------------------------------

router.post('/save', verifyToken, async (req, res) => {

    try {

        const userId = getUserId(req);

        if (!userId) {

            return res.status(401).json({
                success: false,
                message:
                    'Unauthorized: User ID missing from token'
            });
        }

        const {
            age,
            height,
            weight,
            bmi,
            category,
            date
        } = req.body;

        // -------------------------------------------------
        // REQUIRED VALUES
        // -------------------------------------------------

        if (
            height === undefined ||
            weight === undefined ||
            bmi === undefined
        ) {

            return res.status(400).json({
                success: false,
                message:
                    'Height, weight, and calculated BMI values are required.'
            });
        }

        // -------------------------------------------------
        // NUMBER VALIDATION
        // -------------------------------------------------

        const numericAge =
            age !== undefined &&
            age !== null &&
            age !== ''
                ? Number(age)
                : null;

        const numericHeight =
            Number(height);

        const numericWeight =
            Number(weight);

        const numericBmi =
            Number(bmi);

        if (
            !Number.isFinite(numericHeight) ||
            !Number.isFinite(numericWeight) ||
            !Number.isFinite(numericBmi)
        ) {

            return res.status(400).json({
                success: false,
                message:
                    'Height, weight and BMI must be valid numbers.'
            });
        }

        if (
            numericAge !== null &&
            (
                !Number.isFinite(numericAge) ||
                numericAge <= 0 ||
                numericAge > 120
            )
        ) {

            return res.status(400).json({
                success: false,
                message:
                    'Age must be between 1 and 120.'
            });
        }

        if (
            numericHeight <= 0 ||
            numericWeight <= 0 ||
            numericBmi <= 0
        ) {

            return res.status(400).json({
                success: false,
                message:
                    'Height, weight and BMI must be greater than zero.'
            });
        }

        // -------------------------------------------------
        // DATE
        // -------------------------------------------------

        const recordDate =
            normalizeDate(date);

        // -------------------------------------------------
        // CATEGORY
        // Always derive from BMI if client category
        // is missing.
        // -------------------------------------------------

        const resolvedCategory =
            category &&
            String(category).trim()
                ? String(category).trim()
                : getBmiCategory(numericBmi);

        // -------------------------------------------------
        // EMAIL
        //
        // IMPORTANT:
        // We don't trust email from req.body.
        // Only use email from verified JWT.
        // -------------------------------------------------

        const email =
            req.user?.email
                ? String(req.user.email).toLowerCase().trim()
                : undefined;

        // -------------------------------------------------
        // FIND EXISTING RECORD
        //
        // ONE USER + ONE DATE = ONE BMI RECORD
        // -------------------------------------------------

        const existingRecord =
            await BmiRecord.findOne({
                userId,
                date: recordDate
            });

        let savedRecord;

        if (existingRecord) {

            // -------------------------------------------------
            // UPDATE EXISTING SAME-DAY RECORD
            // -------------------------------------------------

            if (numericAge !== null) {
                existingRecord.age = numericAge;
            }

            existingRecord.height =
                numericHeight;

            existingRecord.weight =
                numericWeight;

            existingRecord.bmi =
                Math.round(numericBmi * 10) / 10;

            existingRecord.category =
                resolvedCategory;

            if (email) {
                existingRecord.email = email;
            }

            savedRecord =
                await existingRecord.save();

        } else {

            // -------------------------------------------------
            // CREATE NEW RECORD
            // -------------------------------------------------

            const newRecord =
                new BmiRecord({

                    userId,

                    email,

                    age:
                        numericAge !== null
                            ? numericAge
                            : undefined,

                    height:
                        numericHeight,

                    weight:
                        numericWeight,

                    bmi:
                        Math.round(
                            numericBmi * 10
                        ) / 10,

                    category:
                        resolvedCategory,

                    date:
                        recordDate
                });

            savedRecord =
                await newRecord.save();
        }

        // -------------------------------------------------
        // RESPONSE
        // -------------------------------------------------

        return res.status(200).json({

            success: true,

            message:
                existingRecord
                    ? 'BMI record updated successfully'
                    : 'BMI record saved successfully',

            record: savedRecord
        });

    } catch (err) {

        console.error(
            'Save BMI error:',
            err
        );

        // -------------------------------------------------
        // DUPLICATE KEY SAFETY
        // -------------------------------------------------

        if (err.code === 11000) {

            return res.status(409).json({

                success: false,

                message:
                    'BMI record already exists for this user and date.'
            });
        }

        return res.status(500).json({

            success: false,

            error:
                err.message ||
                'Server error'
        });
    }
});

// ---------------------------------------------------------
// BMI HISTORY
// ---------------------------------------------------------

router.get('/history', verifyToken, async (req, res) => {

    try {

        const userId =
            getUserId(req);

        if (!userId) {

            return res.status(401).json({

                success: false,

                message:
                    'Unauthorized: User ID missing from token'
            });
        }

        // -------------------------------------------------
        // STRICT USER FILTER
        // -------------------------------------------------

        const records =
            await BmiRecord
                .find({
                    userId
                })
                .sort({
                    date: -1,
                    createdAt: -1
                });

        return res.status(200).json({

            success: true,

            records
        });

    } catch (err) {

        console.error(
            'Fetch BMI history error:',
            err
        );

        return res.status(500).json({

            success: false,

            error:
                err.message ||
                'Server error'
        });
    }
});

module.exports = router;
