const express = require('express');
const router = express.Router();

// Fixed imports: changed '../models/bmimodel' and '../middleware/authMiddleware' to direct root imports
const BmiRecord = require('./bmimodel'); 
const verifyToken = require('./authMiddleware'); 

// Save BMI Record
router.post('/save', verifyToken, async (req, res) => {
    try {
        const { age, height, weight, bmi, category, date } = req.body;
        
        const newRecord = new BmiRecord({
            userId: req.user.id, // Use userId ObjectId consistently
            email: req.user.email,
            age,
            height,
            weight,
            bmi,
            category,
            date
        });

        await newRecord.save();
        res.status(201).json({ success: true, message: "BMI record saved successfully" });
    } catch (err) {
        console.error("Save BMI error:", err);
        res.status(500).json({ success: false, error: "Server error" });
    }
});

// Fetch BMI History
router.get('/history', verifyToken, async (req, res) => {
    try {
        const records = await BmiRecord.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json(records);
    } catch (err) {
        console.error("Fetch BMI history error:", err);
        res.status(500).json({ success: false, error: "Server error" });
    }
});

module.exports = router;
