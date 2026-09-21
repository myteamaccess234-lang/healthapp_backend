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
    },

    weight: {
        type: Number,
        required: true
    },

    bmi: {
        type: Number,
        required: true
    },

    category: {
        type: String,
        required: true
    },

    date: {
        type: String,
        required: true
    }

}, {
    timestamps: true
});

// ---------------------------------------------------------
// IMPORTANT
// ONE USER + ONE DATE = ONE BMI RECORD
// ---------------------------------------------------------

bmiSchema.index(
    { userId: 1, date: 1 },
    { unique: true }
);

// ---------------------------------------------------------
// USER-SPECIFIC HISTORY SORTING
// ---------------------------------------------------------

bmiSchema.index(
    { userId: 1, date: -1 }
);

module.exports = mongoose.model(
    'BmiRecord',
    bmiSchema
);
