const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: String, required: true },
    steps: { type: Number, default: 0 },
    caloriesBurned: { type: Number, default: 0 },
    waterLitres: { type: Number, default: 0 },
    mealCount: { type: Number, default: 0 },
    calorieIntake: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Activity', activitySchema);