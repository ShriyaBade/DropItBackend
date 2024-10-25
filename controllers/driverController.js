// backend/controllers/driverController.js
const mongoose = require('mongoose');
const Driver = require('../models/Driver');
const Booking = require('../models/Booking');

// Function to update driver's location
exports.updateDriverLocation = async (req, res) => {
    const { driverId, location } = req.body;

    try {
        const driver = await Driver.findById(driverId);
        if (!driver) return res.status(404).json({ success: false, message: "Driver not found" });

        driver.location = location;
        await driver.save();

        res.status(200).json({ success: true, data: driver });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Function to get driver's location by ID
exports.getDriverLocation = async (req, res) => {
    try {
        const driver = await Driver.findById(req.params.driverId).select('location');
        if (!driver) return res.status(404).json({ success: false, message: "Driver not found" });

        res.status(200).json({ success: true, location: driver.location });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.getCompletedJobs = async (req, res) => {
    try {
        // Find all completed jobs
        const completedJobs = await Booking.find({ status: "Completed" });

        // Calculate total earnings from completed jobs
        const totalEarnings = completedJobs.reduce((total, job) => total + job.estimatedCost, 0);

        res.status(200).json({ completedJobs, totalEarnings });
    } catch (error) {
        console.error("Error fetching completed jobs:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.completeJob = async (req, res) => {
    try {
        const { bookingId } = req.params;

        // Update the status to "Completed"
        const booking = await Booking.findByIdAndUpdate(
            bookingId,
            { status: "Completed" },
            { new: true }
        );

        if (!booking) {
            return res.status(404).json({ success: false, message: "Booking not found" });
        }

        res.status(200).json({ success: true, message: "Job marked as completed", booking });
    } catch (error) {
        console.error("Error completing job:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};
