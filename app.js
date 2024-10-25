// backend/app.js
require('dotenv').config();
const cors = require('cors');
const express = require('express');
const connectDB = require('./config/db');
const bookingRoutes = require('./routes/bookingRoutes');
const driverRoutes = require('./routes/driverRoutes');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
app.use(express.json());
app.use(cors({
    origin: process.env.FRONTEND_URL || 'https://dropitfrontend.onrender.com', // Adjust for your frontend URL
    credentials: true, // Allows cookies to be sent with requests if needed
}));
connectDB();

app.use('/api/bookings', bookingRoutes);
app.use('/api/driver', driverRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);

module.exports = app;
