const mongoose = require('mongoose')

const LaunchesSchema = new mongoose.Schema({
    flightNumber: {
        type: Number,
        required: true,
    },
    launchDate: {
        type: Date,
        required: true,
    },
    mission: {
        type: String,
        required: true
    },
    rocket: {
        type: String,
        required: true
    },
    target: {
        type: String,
        required: true
    },
    customers: [Strings],
    upcoming: {
        type: Boolean,
        required: true
    },
    success: {
        type: String,
        required: true,
        default: true
    }
});

// connects launchesSchema with the "launches" collection
module.exports = mongoose.model('Launch', LaunchesSchema)