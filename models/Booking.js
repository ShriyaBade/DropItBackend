// models/Booking.js
const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    pickupLocation: { type: { lat: Number, lng: Number }, required: true },
    dropoffLocation: { type: { lat: Number, lng: Number }, required: true },
    pickupAddress: { type: String, required: true },
    dropoffAddress: { type: String, required: true },
    vehicleType: { type: String, enum: ['Bike', 'Car', 'Truck'], required: true },
    estimatedCost: { type: Number, required: true },
    status: { type: String, enum: ['Pending', 'Accepted', 'Completed'], default: 'Pending' },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    driver: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver' } // New driver reference field
});

module.exports = mongoose.model('Booking', bookingSchema);
