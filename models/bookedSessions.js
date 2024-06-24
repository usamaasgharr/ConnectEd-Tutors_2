const mongoose = require('mongoose');

// Define schema for booked sessions
const bookedSessionSchema = new mongoose.Schema({
    tutor: {
        type: mongoose.Schema.Types.ObjectId,
        
        required: true
    },
    student: {
        type: mongoose.Schema.Types.ObjectId,
        
        required: true
    },
    session:{
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
});

// Create a model for booked sessions
const BookedSession = mongoose.model('BookedSession', bookedSessionSchema);

module.exports = BookedSession;
