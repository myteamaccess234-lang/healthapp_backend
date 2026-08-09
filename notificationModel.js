const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  category: { type: String, required: true }, // e.g., 'Hydration', 'Meals', 'Reminders'
  title: { type: String, required: true },
  message: { type: String, required: true },
  isInteractive: { type: Boolean, default: false },
  actionTaken: { type: String, default: null }, // 'yes-water', 'yes-food', 'no-forgot', etc.
  status: { type: String, default: 'Unread' },  // 'Unread', 'Completed', 'Snoozed'
  snoozedUntil: { type: Date, default: null }   // Target time for 20-minute repeats
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
