const express = require('express');
const router = express.Router();

// Direct imports matching your root directory layout
const BmiRecord = require('./bmimodel'); 
const verifyToken = require('./authMiddleware'); 

// Save BMI Record
router.post('/save', verifyToken, async (req, res) => {
    try {
        const { age, height, weight, bmi, category, date } = req.body;
        
        // Robust userId fallback check matching authMiddleware output
        const userId = req.user?.id || req.user?._id || req.user?.userId;
        const email = req.user?.email || req.body?.email;

        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized: User ID missing from token" });
        }

        const newRecord = new BmiRecord({
            userId,
            email,
            age,
            height,
            weight,
            bmi,
            category,
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

// Fetch BMI History
router.get('/history', verifyToken, async (req, res) => {
    try {
        const userId = req.user?.id || req.user?._id || req.user?.userId;

        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized: User ID missing from token" });
        }

        const records = await BmiRecord.find({ userId }).sort({ createdAt: -1 });
        res.status(200).json(records);
    } catch (err) {
        console.error("Fetch BMI history error:", err.message);
        res.status(500).json({ success: false, error: err.message || "Server error" });
    }
});

module.exports = router;
