const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true, // Prevents duplicate accounts from casing differences (e.g., User@email.com vs user@email.com)
        trim: true,      // Removes accidental whitespace
        index: true
    },

    otp: {
        type: String,
        default: null
    },

    otpExpiry: {
        type: Date,
        default: null
    },

    // NEW FIELDS FOR ACHIEVEMENTS & MILESTONES
    lifetimeSteps: {
        type: Number,
        default: 0
    },

    achievements: {
        loggedIn: { type: Boolean, default: false },
        firstDay: { type: Boolean, default: false },
        oneWeekHero: { type: Boolean, default: false },
        oneMonthHero: { type: Boolean, default: false },
        hydrationHero: { type: Boolean, default: false },
        mealHero: { type: Boolean, default: false },
        twoLakhSteps: { type: Boolean, default: false },
        allGoalsCompleted: { type: Boolean, default: false }
    }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
