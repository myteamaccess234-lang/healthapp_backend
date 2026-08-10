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
    
    // BMI tracking metrics
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

// COMPOUND INDEX: Guarantees lightning-fast lookups for a user's specific daily log
activitySchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Activity', activitySchema);
