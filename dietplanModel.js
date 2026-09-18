const mongoose = require('mongoose');

const dietPlanSchema = new mongoose.Schema({
  age: { type: Number, required: true },
  category: { type: String, required: true },
  variant: { type: Number, required: true },
  schedule: { type: Object, required: true }
});

module.exports = mongoose.model('DietPlan', dietPlanSchema);
