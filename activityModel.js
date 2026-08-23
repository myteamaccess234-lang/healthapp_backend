const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true,
        index: true
    },

    date: { 
        type: String, 
        required: true
    }, // Stored in YYYY-MM-DD format

    steps: { 
        type: Number, 
        default: 0
    },

    caloriesBurned: { 
        type: Number, 
        default: 0
    },

    waterLitres: { 
        type: Number, 
        default: 0
    },

    mealCount: { 
        type: Number, 
        default: 0
    },

    calorieIntake: { 
        type: Number, 
        default: 0
    },

    // =========================================================
    // SLEEP TRACKING
    // =========================================================

    // Total sleep duration in minutes
    sleepMinutes: {
        type: Number,
        default: 0
    },

    // Time when sleep started
    sleepStart: {
        type: Date,
        default: null
    },

    // Time when user woke up / sleep stopped
    sleepEnd: {
        type: Date,
        default: null
    },

    // Whether the user is currently sleeping
    isSleeping: {
        type: Boolean,
        default: false
    },

    // =========================================================
    // BMI TRACKING
    // =========================================================

    bmi: { 
        type: Number, 
        default: null
    },

    height: { 
        type: Number, 
        default: null
    },

    weight: { 
        type: Number, 
        default: null
    }

}, { 
    timestamps: true
});

// COMPOUND INDEX
activitySchema.index(
    { userId: 1, date: 1 },
    { unique: true }
);

module.exports = mongoose.model('Activity', activitySchema);
