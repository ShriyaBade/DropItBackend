// backend/controllers/bookingController.js
const Booking = require('../models/Booking');
const Driver = require('../models/Driver');

exports.createBooking = async (req, res) => {
    try {
        const { pickupLocation, dropoffLocation, pickupAddress, dropoffAddress, vehicleType, estimatedCost } = req.body;

        const booking = new Booking({
            pickupLocation,
            dropoffLocation,
            pickupAddress,
            dropoffAddress,
            vehicleType,
            estimatedCost,
        });

        await booking.save();
        res.status(201).json({ success: true, booking });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Assign driver to a booking
exports.assignDriver = async (req, res) => {
    try {
        const { driverLocation } = req.body;
        if (!driverLocation || !driverLocation.lat || !driverLocation.lng) {
            return res.status(400).json({ success: false, message: "Driver location is required." });
        }

        // Find an available driver
        let driver = await Driver.findOne({ isAvailable: true });

        // If no available driver exists, create a default driver
        if (!driver) {
            driver = await Driver.create({
                name: 'Default Driver',
                isAvailable: true,
                location: { lat: driverLocation.lat, lng: driverLocation.lng },
            });
            console.log("Default driver created:", driver);
        }

        // Assign the job to the driver and update booking status
        const booking = await Booking.findByIdAndUpdate(
            req.params.id,
            {
                driver: driver._id,
                status: 'Accepted',
                driverLocation: driverLocation,
            },
            { new: true }
        );

        // Set driver availability to false after assignment
        driver.isAvailable = false;
        await driver.save();

        res.status(200).json({ success: true, data: booking });
    } catch (error) {
        console.error("Error assigning driver:", error.message);
        res.status(500).json({ success: false, error: error.message });
    }
};

// Complete a booking
exports.completeBooking = async (req, res) => {
    try {
        const booking = await Booking.findByIdAndUpdate(req.params.id, { status: 'Delivered' }, { new: true });
        const driver = await Driver.findById(booking.driver);
        driver.isAvailable = true;
        await driver.save();

        res.status(200).json({ success: true, data: booking });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

exports.getAllBookings = async (req, res) => {
    try {
        // Check if a status query parameter is provided
        const { status } = req.query;
        
        // If status is provided, filter by status; otherwise, return all bookings
        const filter = status ? { status } : {};

        const bookings = await Booking.find(filter)
            .populate('driver') // Populate driver details
            .populate('userId'); // Optionally populate user details if needed

        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
