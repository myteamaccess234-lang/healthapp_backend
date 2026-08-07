// Force DNS resolution order to fix ECONNREFUSED with MongoDB Atlas
const dns = require('dns');
if (dns.setDefaultResultOrder) {
    dns.setDefaultResultOrder('ipv4first');
}

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

// Import Routes
const bmiRoutes = require('./bmiroutes');
const authRoutes = require('./authroutes');
const activityRoutes = require('./activityroutes');
const notificationRoutes = require('./notifications');
const pushRoutes = require('./pushRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// 1. Trust proxy headers (Required on Render so cookies/protocol pass correctly to WebViews)
app.enable('trust proxy');

// Middleware
app.use(express.json());

// 2. Explicit CORS configuration for Mobile WebViews & Web Browsers
app.use(cors({
    origin: '*', 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Serve static files directly from root
app.use(express.static(__dirname));

// Mount Routes
app.use('/api/bmi', bmiRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/push', pushRoutes);

// Route for Service Worker
app.get('/sw.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'sw.js'));
});

// Base route - serves notes.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'notes.html'));
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
