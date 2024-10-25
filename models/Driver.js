// backend/models/Driver.js
const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
    name: { type: String, required: true },
    isAvailable: { type: Boolean, default: true },
    location: {
        lat: { type: Number, default: 0 },
        lng: { type: Number, default: 0 }
    }
});

module.exports = mongoose.model('Driver', driverSchema);
