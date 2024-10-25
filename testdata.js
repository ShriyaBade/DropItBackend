// seed.js
const mongoose = require('mongoose');
const User = require('./models/User');
const Driver = require('./models/Driver');
const Booking = require('./models/Booking');

const ObjectId = mongoose.Types.ObjectId;

const users = [
    { _id: new ObjectId(), name: 'Alice Smith', email: 'alice@example.com' },
    { _id: new ObjectId(), name: 'Bob Johnson', email: 'bob@example.com' }
];

const drivers = [
    { _id: new ObjectId(), name: 'Carlos Martinez', location: { lat: 37.7749, lng: -122.4194 }, status: 'Available' },
    { _id: new ObjectId(), name: 'Dana Lee', location: { lat: 37.7849, lng: -122.4094 }, status: 'Available' }
];

const bookings = [
    {
        _id: new ObjectId(),
        userId: users[0]._id,
        pickupLocation: { lat: 37.7749, lng: -122.4194 },
        dropoffLocation: { lat: 37.7849, lng: -122.4094 },
        pickupAddress: '500 Terry A Francois Blvd, San Francisco, CA 94158',
        dropoffAddress: '300 Howard St, San Francisco, CA 94105',
        vehicleType: 'Car',
        estimatedCost: 400,
        status: 'Pending'
    },
    {
        _id: new ObjectId(),
        userId: users[1]._id,
        pickupLocation: { lat: 37.7749, lng: -122.4194 },
        dropoffLocation: { lat: 37.8049, lng: -122.4294 },
        pickupAddress: '123 Market St, San Francisco, CA 94103',
        dropoffAddress: '500 Embarcadero, San Francisco, CA 94111',
        vehicleType: 'Truck',
        estimatedCost: 1000,
        status: 'Pending'
    },
    {
        _id: new ObjectId(),
        userId: users[0]._id,
        driverId: drivers[0]._id,
        pickupLocation: { lat: 37.7749, lng: -122.4194 },
        dropoffLocation: { lat: 37.7649, lng: -122.4294 },
        pickupAddress: '800 Brannan St, San Francisco, CA 94103',
        dropoffAddress: '200 Embarcadero, San Francisco, CA 94105',
        vehicleType: 'Bike',
        estimatedCost: 150,
        status: 'Accepted'
    }
];

const seedDatabase = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/atlan');
        await User.insertMany(users);
        await Driver.insertMany(drivers);
        await Booking.insertMany(bookings);
        console.log('Database seeded successfully');
    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        mongoose.connection.close();
    }
};

seedDatabase();
