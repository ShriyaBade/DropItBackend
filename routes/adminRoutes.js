// backend/routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const {
    getBookingStats,
    getDriverStats,
    getBookingTrends,
    getRevenueStats,
    getAverageRevenue,    // New route for average revenue per booking
    getTopRoutes,         // New route for top routes by booking volume
    getTotalEarnings      // New route for total earnings over a date range
} = require('../controllers/adminController');

router.get('/booking-stats', getBookingStats); // Total bookings and statuses
router.get('/driver-stats', getDriverStats);   // Driver activity and availability
router.get('/booking-trends', getBookingTrends); // Booking trends over time
router.get('/revenue-stats', getRevenueStats);   // Revenue insights over time
router.get('/average-revenue', getAverageRevenue); // Average revenue per completed booking
router.get('/top-routes', getTopRoutes); // Most popular routes based on booking volume
router.get('/total-earnings', getTotalEarnings); // Total earnings over specified date range

module.exports = router;
