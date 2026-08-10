const express = require('express');
const router = express.Router();
const webpush = require('web-push');
const mongoose = require('mongoose');

// Direct imports matching root directory layout
const Subscription = require('./subscriptionModel');
const Notification = require('./notificationModel');
const verifyToken = require('./authMiddleware');

// Configure web-push with VAPID keys from .env
if (process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(
    process.env.VAPID_EMAIL || 'mailto:support@healthapp.com',
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );
} else {
  console.warn("⚠️ WARNING: VAPID keys are missing from environment variables!");
}

// 1. Save or update push subscription for the logged-in user
router.post('/subscribe', verifyToken, async (req, res) => {
  const subscription = req.body;
  const userId = req.user?.id || req.user?._id || req.user?.userId;

  if (!userId) {
    return res.status(401).json({ success: false, message: "Unauthorized: User ID missing from token" });
  }

  if (!subscription || !subscription.endpoint) {
    return res.status(400).json({ success: false, message: "Invalid subscription payload provided." });
  }

  try {
    // Upsert subscription record bound to the userId
    await Subscription.findOneAndUpdate(
      { endpoint: subscription.endpoint },
      { ...subscription, userId },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.status(201).json({ success: true, message: 'Push subscription saved successfully.' });
  } catch (error) {
    console.error('Error saving push subscription:', error.message);
    res.status(500).json({ success: false, error: 'Failed to save push subscription.' });
  }
});

// 2. Trigger or send a push notification (with DB tracking and quick-action payload support)
router.post('/send-notification', verifyToken, async (req, res) => {
  const { title, body, message, category, isInteractive } = req.body;
  const userId = req.user?.id || req.user?._id || req.user?.userId || req.body.userId;

  if (!userId) {
    return res.status(400).json({ success: false, message: "User ID is required to send notification." });
  }

  try {
    // Step A: Create notification document in MongoDB
    const notificationRecord = await Notification.create({
      userId,
      title: title || 'Health App Alert',
      message: message || body || 'Reminder from your health tracker!',
      category: category || 'Hydration',
      isInteractive: isInteractive !== undefined ? isInteractive : true,
      status: 'Unread'
    });

    // Step B: Build payload containing _id for Service Worker interactive actions
    const payload = JSON.stringify({
      title: notificationRecord.title,
      body: notificationRecord.message,
      _id: notificationRecord._id.toString(),
      category: notificationRecord.category,
      isInteractive: notificationRecord.isInteractive
    });

    // Step C: Retrieve registered subscriptions for this user
    const subscriptions = await Subscription.find({ userId });

    if (subscriptions.length === 0) {
      return res.status(200).json({ 
        success: true, 
        message: 'Notification saved to DB, but no active push devices found for this user.',
        notificationId: notificationRecord._id 
      });
    }

    // Step D: Broadcast push notification with automatic stale subscription cleanup
    const pushPromises = subscriptions.map(sub =>
      webpush.sendNotification(sub, payload).catch(async err => {
        if (err.statusCode === 410 || err.statusCode === 404 || err.body?.includes('unsubscribed or expired')) {
          console.log(`Cleaning up expired subscription endpoint: ${sub.endpoint}`);
          await Subscription.deleteOne({ endpoint: sub.endpoint });
        } else {
          console.error('Error sending push notification:', err.message);
        }
      })
    );

    await Promise.all(pushPromises);

    res.status(200).json({ 
      success: true, 
      message: 'Notification sent and logged successfully.', 
      notificationId: notificationRecord._id 
    });

  } catch (error) {
    console.error('Error broadcasting notification:', error.message);
    res.status(500).json({ success: false, error: 'Failed to send notifications.' });
  }
});

module.exports = router;
