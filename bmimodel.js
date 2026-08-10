const mongoose = require('mongoose');

const bmiSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true,
        index: true 
    },
    email: { 
        type: String, 
        required: true,
        lowercase: true,
        trim: true
    },
    age: { 
        type: Number, 
        required: true 
    },
    height: { 
        type: Number, 
        required: true 
    }, // Stored in centimeters or meters (consistent with frontend)
    weight: { 
        type: Number, 
        required: true 
    }, // Stored in kilograms or pounds (consistent with frontend)
    bmi: { 
        type: Number, 
        required: true 
    },
    category: { 
        type: String, 
        required: true 
    }, // e.g., 'Normal weight', 'Overweight'
    date: { 
        type: String, 
        required: true 
    } // Stored in YYYY-MM-DD format
}, { 
    timestamps: true 
});

// Compound index for efficient user-specific date sorting
bmiSchema.index({ userId: 1, date: -1 });

module.exports = mongoose.model('BmiRecord', bmiSchema);
