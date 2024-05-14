const mongoose = require('mongoose');

// Define schema for booked sessions
const queriesSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    }, 
    message: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
});

// Create a model for booked sessions
const userQueries = mongoose.model('querie', queriesSchema);

module.exports = userQueries;
