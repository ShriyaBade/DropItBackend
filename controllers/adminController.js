// backend/controllers/adminController.js
const Booking = require('../models/Booking');
const Driver = require('../models/Driver');
const mongoose = require('mongoose');

// 1. Get Booking Stats by Status
exports.getBookingStats = async (req, res) => {
    try {
        const statuses = await Booking.aggregate([
            { $group: { _id: "$status", count: { $sum: 1 } } }
        ]);

        const formattedStatuses = statuses.map(status => ({
            status: status._id,
            count: status.count
        }));

        res.status(200).json({ statuses: formattedStatuses });
    } catch (error) {
        console.error("Error fetching booking stats:", error.message);
        res.status(500).json({ success: false, error: error.message });
    }
};

// 2. Get Driver Stats (Available vs Busy)
exports.getDriverStats = async (req, res) => {
    try {
        const availableCount = await Driver.countDocuments({ isAvailable: true });
        const busyCount = await Driver.countDocuments({ isAvailable: false });

        res.status(200).json({ available: availableCount, busy: busyCount });
    } catch (error) {
        console.error("Error fetching driver stats:", error.message);
        res.status(500).json({ success: false, error: error.message });
    }
};

// 3. Get Booking Trends (e.g., Daily Bookings Over the Last 7 Days)
exports.getBookingTrends = async (req, res) => {
    try {
        const pastWeek = new Date();
        pastWeek.setDate(pastWeek.getDate() - 7);

        const trends = await Booking.aggregate([
            { $match: { createdAt: { $gte: pastWeek } } },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { "_id": 1 } } // Sort by date
        ]);

        const dates = trends.map(trend => trend._id);
        const counts = trends.map(trend => trend.count);

        res.status(200).json({ dates, counts });
    } catch (error) {
        console.error("Error fetching booking trends:", error.message);
        res.status(500).json({ success: false, error: error.message });
    }
};

// 4. Get Revenue Stats Over Time
exports.getRevenueStats = async (req, res) => {
    try {
        const pastWeek = new Date();
        pastWeek.setDate(pastWeek.getDate() - 7);

        const revenue = await Booking.aggregate([
            { $match: { createdAt: { $gte: pastWeek }, status: "Completed" } },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    totalAmount: { $sum: "$estimatedCost" }
                }
            },
            { $sort: { "_id": 1 } } // Sort by date
        ]);

        const dates = revenue.map(day => day._id);
        const amounts = revenue.map(day => day.totalAmount);

        res.status(200).json({ dates, amounts });
    } catch (error) {
        console.error("Error fetching revenue stats:", error.message);
        res.status(500).json({ success: false, error: error.message });
    }
};
// 5. Get Average Revenue per Completed Booking
exports.getAverageRevenue = async (req, res) => {
    try {
        const avgRevenue = await Booking.aggregate([
            { $match: { status: "Completed" } },
            { $group: { _id: null, avgRevenue: { $avg: "$estimatedCost" } } }
        ]);

        res.status(200).json({ avgRevenue: avgRevenue[0]?.avgRevenue || 0 });
    } catch (error) {
        console.error("Error fetching average revenue:", error.message);
        res.status(500).json({ success: false, error: error.message });
    }
};

// 6. Get Top Routes by Booking Volume
exports.getTopRoutes = async (req, res) => {
    try {
        const topRoutes = await Booking.aggregate([
            {
                $group: {
                    _id: { pickup: "$pickupAddress", dropoff: "$dropoffAddress" },
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } },
            { $limit: 5 } // Top 5 routes
        ]);

        res.status(200).json(topRoutes);
    } catch (error) {
        console.error("Error fetching top routes:", error.message);
        res.status(500).json({ success: false, error: error.message });
    }
};
// 7. Get Total Earnings Over a Date Range
exports.getTotalEarnings = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const matchStage = { createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) }, status: "Completed" };

        const totalEarnings = await Booking.aggregate([
            { $match: matchStage },
            { $group: { _id: null, totalAmount: { $sum: "$estimatedCost" } } }
        ]);

        res.status(200).json({ totalAmount: totalEarnings[0]?.totalAmount || 0 });
    } catch (error) {
        console.error("Error fetching total earnings:", error.message);
        res.status(500).json({ success: false, error: error.message });
    }
};