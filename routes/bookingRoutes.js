// backend/routes/bookingRoutes.js
const express = require('express');
const router = express.Router();
const { createBooking, getAllBookings, assignDriver, completeBooking } = require('../controllers/bookingController');

router.post('/', createBooking); // Create a booking
router.get('/', getAllBookings); // Get all bookings
router.put('/:id/assign', assignDriver); // Assign driver to booking
router.put('/:id/complete', completeBooking); // Complete a booking

module.exports = router;
