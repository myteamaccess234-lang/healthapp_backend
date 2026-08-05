const mongoose = require('mongoose');

const bmiSchema = new mongoose.Schema({
    email: { type: String, required: true },
    age: { type: Number, required: true },
    height: { type: Number, required: true },
    weight: { type: Number, required: true },
    bmi: { type: Number, required: true },
    category: { type: String, required: true },
    date: { type: String, required: true }
});

module.exports = mongoose.model('BmiRecord', bmiSchema);