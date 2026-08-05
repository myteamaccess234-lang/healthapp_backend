const express = require('express');
const router = express.Router();
const webpush = require('web-push');
const mongoose = require('mongoose');
const Subscription = require('../models/subscriptionModel');
const Notification = require('../models/notificationModel');

// Configure web-push with your VAPID keys from your .env file
webpush.setVapidDetails(
  process.env.VAPID_EMAIL,
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

// 1. Save subscription from frontend
router.post('/subscribe', async (req, res) => {
  const subscription = req.body;
  try {
    await Subscription.findOneAndUpdate(
      { endpoint: subscription.endpoint },
      subscription,
      { upsert: true, returnDocument: 'after' }
    );
    res.status(201).json({ message: 'Push subscription saved successfully.' });
  } catch (error) {
    console.error('Error saving subscription:', error);
    res.status(500).json({ error: 'Failed to save subscription.' });
  }
});

// 2. Test endpoint to trigger a notification manually (with auto-cleanup and DB ID tracking)
router.post('/send-notification', async (req, res) => {
  const { title, body, message, category, actions, userId } = req.body;
  
  try {
    // Step A: Create a notification document satisfying schema validation requirements
    const notificationRecord = await Notification.create({
      userId: userId || new mongoose.Types.ObjectId(), // Fallback dummy ObjectId to pass schema validation
      title: title || 'Health App Alert',
      message: message || body || 'Reminder from your app!',
      category: category || 'general',
      actions: actions || []
    });

    // Step B: Build the payload containing the database _id
    const payload = JSON.stringify({
      title: notificationRecord.title,
      body: notificationRecord.message,
      _id: notificationRecord._id.toString(), // <-- Crucial for sw.js background fetch
      actions: notificationRecord.actions
    });

    const subscriptions = await Subscription.find();
    
    if (subscriptions.length === 0) {
      return res.status(404).json({ message: 'No push subscriptions found in database.' });
    }
    
    // Step C: Send push to all stored subscriptions with automatic error cleanup
    const notifications = subscriptions.map(sub => 
      webpush.sendNotification(sub, payload).catch(async err => {
        if (err.statusCode === 410 || err.body?.includes('unsubscribed or expired')) {
          console.log('Expired push subscription detected. Automatically removing from database...');
          await Subscription.deleteOne({ endpoint: sub.endpoint });
        } else {
          console.error('Error sending push:', err);
        }
      })
    );

    await Promise.all(notifications);
    res.status(200).json({ message: 'Notifications processed successfully.', notificationId: notificationRecord._id });
  } catch (error) {
    console.error('Error broadcasting notification:', error);
    res.status(500).json({ error: 'Failed to send notifications.' });
  }
});

module.exports = router;