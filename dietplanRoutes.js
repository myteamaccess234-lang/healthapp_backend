const express = require('express');
const router = express.Router();
const DietPlan = require('./dietplanModel');

// GET diet plan based on age and category
// Example: /api/dietplans?age=51&category=underweight
router.get('/', async (req, res) => {
  try {
    const { age, category } = req.query;
    
    const plan = await DietPlan.findOne({ age: Number(age) });
    if (!plan) {
      return res.status(404).json({ error: 'Diet plan not found for this age group.' });
    }

    const categoryData = plan.categories[category];
    if (!categoryData) {
      return res.status(404).json({ error: 'Invalid category specified.' });
    }

    res.status(200).json(categoryData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
