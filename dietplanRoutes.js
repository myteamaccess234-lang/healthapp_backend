const express = require('express');
const router = express.Router();
const DietPlan = require('./dietplanModel');

// GET diet plan based on age, category, and variant
router.get('/', async (req, res) => {
  try {
    const { age, category, variant } = req.query;

    const plan = await DietPlan.findOne({
      age: Number(age),
      category: category.toLowerCase(),
      variant: Number(variant || 1)
    });

    if (!plan) {
      return res.status(404).json({ error: "Diet plan not found." });
    }

    res.json(plan);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error while fetching diet plan" });
  }
});

module.exports = router;
