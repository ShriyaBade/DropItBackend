// backend/routes/driverRoutes.js
const express = require('express');
const router = express.Router();
const { updateDriverLocation, getDriverLocation, completeJob, getCompletedJobs } = require('../controllers/driverController');

// Route to update driver's location
router.put('/location', updateDriverLocation); // PUT request to update driver location

// Route to get driver's location by ID
router.get('/:driverId/location', getDriverLocation);
router.put('/bookings/:bookingId/complete', completeJob);
router.get('/:driverId/completed-jobs', getCompletedJobs);

module.exports = router;
