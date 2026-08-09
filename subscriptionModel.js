const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: false,
    index: true // Speeds up Subscription.find({ userId }) lookups
  },
  endpoint: { 
    type: String, 
    required: true, 
    unique: true 
  },
  keys: {
    p256dh: { type: String, required: true },
    auth: { type: String, required: true }
  }
}, { timestamps: true });

module.exports = mongoose.model('Subscription', subscriptionSchema);
