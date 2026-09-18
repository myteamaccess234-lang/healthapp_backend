const mongoose = require('mongoose');

const dietPlanSchema = new mongoose.Schema({
  age: { type: Number, required: true, unique: true },
  categories: {
    underweight: { type: mongoose.Schema.Types.Mixed, required: true },
    normal: { type: mongoose.Schema.Types.Mixed, required: true },
    overweight: { type: mongoose.Schema.Types.Mixed, required: true }
  }
});

module.exports = mongoose.model('DietPlan', dietPlanSchema);
