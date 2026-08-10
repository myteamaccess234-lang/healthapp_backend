const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true, 
    ref: 'User',
    index: true 
  },
  category: { 
    type: String, 
    required: true,
    enum: ['Hydration', 'Meals', 'Reminders', 'General'],
    default: 'Hydration'
  },
  title: { 
    type: String, 
    required: true 
  },
  message: { 
    type: String, 
    required: true 
  },
  isInteractive: { 
    type: Boolean, 
    default: false 
  },
  actionTaken: { 
    type: String, 
    default: null 
  }, // e.g., 'yes-water', 'yes-food', 'no-forgot', 'snooze'
  status: { 
    type: String, 
    enum: ['Unread', 'Completed', 'Snoozed', 'Dismissed'],
    default: 'Unread' 
  },
  snoozedUntil: { 
    type: Date, 
    default: null,
    index: true // Indexing allows rapid background lookup for expired snoozes
  }
}, { 
  timestamps: true 
});

module.exports = mongoose.model('Notification', notificationSchema);
