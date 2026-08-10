const express = require('express');
const router = express.Router();

// Direct imports matching your root directory layout
const BmiRecord = require('./bmimodel'); 
const verifyToken = require('./authMiddleware'); 

// Helper function to derive BMI category if omitted by client
const getBmiCategory = (bmi) => {
    if (bmi < 18.5) return 'Underweight';
    if (bmi < 25.0) return 'Normal weight';
    if (bmi < 30.0) return 'Overweight';
    return 'Obese';
};

// 1. Save BMI Record
router.post('/save', verifyToken, async (req, res) => {
    try {
        const { age, height, weight, bmi, category, date } = req.body;
        
        // Robust userId fallback check matching authMiddleware output
        const userId = req.user?.id || req.user?._id || req.user?.userId;
        const email = req.user?.email || req.body?.email;

        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized: User ID missing from token" });
        }

        if (height === undefined || weight === undefined || bmi === undefined) {
            return res.status(400).json({ 
                success: false, 
                message: "Height, weight, and calculated BMI values are required." 
            });
        }

        const numericBmi = parseFloat(bmi);
        const resolvedCategory = category || getBmiCategory(numericBmi);

        const newRecord = new BmiRecord({
            userId,
            email,
            age,
            height: parseFloat(height),
            weight: parseFloat(weight),
            bmi: Math.round(numericBmi * 10) / 10, // Round to 1 decimal place
            category: resolvedCategory,
            date: date || new Date().toISOString().split('T')[0]
        });

        await newRecord.save();
        
        res.status(201).json({ 
            success: true, 
            message: "BMI record saved successfully",
            record: newRecord 
        });
    } catch (err) {
        console.error("Save BMI error:", err.message);
        res.status(500).json({ success: false, error: err.message || "Server error" });
    }
});

// 2. Fetch BMI History
router.get('/history', verifyToken, async (req, res) => {
    try {
        const userId = req.user?.id || req.user?._id || req.user?.userId;

        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized: User ID missing from token" });
        }

        // Fetch records belonging strictly to this user sorted newest first
        const records = await BmiRecord.find({ userId }).sort({ date: -1, createdAt: -1 });
        
        res.status(200).json(records);
    } catch (err) {
        console.error("Fetch BMI history error:", err.message);
        res.status(500).json({ success: false, error: err.message || "Server error" });
    }
});

module.exports = router;
