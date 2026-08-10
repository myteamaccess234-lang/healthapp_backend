const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cron = require('node-cron');
const webpush = require('web-push');
require('dotenv').config();

// Mongoose Models - Exact casing from repository
const Notification = require('./notificationModel');
const Subscription = require('./subscriptionModel');

// Import Feature Routers - Exact filenames from repository
const authRouter = require('./authroutes');
const activityRouter = require('./activityroutes');
const bmiRouter = require('./bmiroutes');
const notificationRouter = require('./notifications');
const pushRouter = require('./pushRoutes');

const app = express();

// Enable CORS for cross-origin PWA apps
app.use(cors());

// Middleware to parse incoming JSON requests
app.use(express.json());

// ------------------- BASE ENDPOINTS -------------------

// Root health check endpoint
app.get('/', (req, res) => {
    res.send('Health App Server is active and running!');
});

// Health check endpoint for keep-awake services
app.get('/health', (req, res) => {
    res.status(200).send('OK');
});

// ------------------- REGISTER FEATURE ROUTERS -------------------

app.use('/api/auth', authRouter);
app.use('/api/activities', activityRouter);
app.use('/api/bmi', bmiRouter);
app.use('/api/notifications', notificationRouter);
app.use('/api/push', pushRouter);

// ------------------- BACKGROUND SNOOZE SCHEDULER -------------------

// Check every minute for notifications where snoozedUntil has elapsed
cron.schedule('* * * * *', async () => {
    try {
        const now = new Date();
        const dueNotifications = await Notification.find({
            status: 'Snoozed',
            snoozedUntil: { $lte: now }
        });

        for (const notification of dueNotifications) {
            const subscriptions = await Subscription.find({ userId: notification.userId });
            
            const payload = JSON.stringify({
                title: `⏰ Reminder: ${notification.title}`,
                body: notification.message,
                id: notification._id.toString(),
                category: notification.category
            });

            for (const sub of subscriptions) {
                webpush.sendNotification({
                    endpoint: sub.endpoint,
                    keys: sub.keys
                }, payload).catch((err) => console.error("Cron Push Error:", err.message));
            }

            // Reset notification state back to Unread
            notification.status = 'Unread';
            notification.snoozedUntil = null;
            await notification.save();
        }
    } catch (err) {
        console.error("Cron snooze job error:", err.message);
    }
});

// ------------------- SERVER & DB INITIALIZATION -------------------

const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;

if (!MONGO_URI) {
    console.error("CRITICAL ERROR: MONGO_URI environment variable is missing!");
} else {
    mongoose.connect(MONGO_URI)
        .then(() => console.log('>>> MongoDB Connected Successfully'))
        .catch(err => console.error('>>> MongoDB Connection Error:', err.message));
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`>>> Server is live and listening on port ${PORT}`);
});
