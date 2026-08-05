const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  category: { type: String, required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  isInteractive: { type: Boolean, default: false },
  status: { type: String, default: 'Unread' }, // Added to track status like 'Completed' or 'Snoozed'
  snoozedUntil: { type: Date, default: null }  // Added to track snooze expiration times
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);