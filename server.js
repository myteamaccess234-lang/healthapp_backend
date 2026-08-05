// Force DNS resolution order to fix ECONNREFUSED with MongoDB Atlas
const dns = require('dns');
if (dns.setDefaultResultOrder) {
    dns.setDefaultResultOrder('ipv4first');
}

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Import Routes (Direct imports from root directory as shown in your screenshot)
const bmiRoutes = require('./bmiroutes');
const authRoutes = require('./authroutes');
const activityRoutes = require('./activityroutes');
const notificationRoutes = require('./notifications');
const pushRoutes = require('./pushRoutes');

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
