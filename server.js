// Force DNS resolution order to fix ECONNREFUSED with MongoDB Atlas
const dns = require('dns');
if (dns.setDefaultResultOrder) {
    dns.setDefaultResultOrder('ipv4first');
}

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');

// Import Models (matching your exact filenames)
const Notification = require('./models/notificationModel'); 
const Activity = require('./models/activityModel'); 

// Import Routes (matching your exact filenames)
const bmiRoutes = require('./routes/bmiroutes');
const authRoutes = require('./routes/authroutes');
const activityRoutes = require('./routes/activityroutes');
const notificationRoutes = require('./routes/notifications');
const pushRoutes = require('./routes/pushRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Mount Routes
app.use('/api/bmi', bmiRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/push', pushRoutes);

// Base route for health check
app.get('/', (req, res) => {
    res.status(200).json({ message: "Health App Backend is running!" });
});

// Notification Response Handler Route
app.patch('/api/notifications/:id/respond', async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: "Access denied. No token provided." });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_secret_key');
        const userId = decoded.userId || decoded.id;

        const { response } = req.body; // 'yes' or 'no'
        const notificationId = req.params.id;

        const notification = await Notification.findOne({ _id: notificationId, userId });
        if (!notification) {
            return res.status(404).json({ error: "Notification not found" });
        }

        notification.status = response === 'yes' ? 'Completed' : 'Ignored';
        await notification.save();

        // Handle Water Intake increment if category is Water
        if (response === 'yes' && notification.category === 'Water') {
            const todayStr = new Date().toLocaleDateString();
            await Activity.findOneAndUpdate(
                { userId, date: todayStr },
                { $inc: { waterLitres: 0.25 } },
                { upsert: true, new: true }
            );
        }

        res.json({ success: true, message: "Response recorded successfully!", notification });
    } catch (err) {
        console.error("Error handling notification response:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

// MongoDB Atlas Connection & Server Startup
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("Connected to MongoDB Atlas successfully!");
        app.listen(PORT, () => {
            console.log(`Server listening on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error("MongoDB connection error:", err.message);
    });
