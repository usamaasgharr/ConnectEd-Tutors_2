// models/TutorAvailability.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tutorAvailabilitySchema = new Schema({
    isAvailable: {
        type: Boolean,
        required: true,
        default: true
    },
    tutor: {
        type: Schema.Types.ObjectId,
        ref: 'usersdatas',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    start_time: {
        type: String, 
        required: true
    },
    end_time: {
        type: String,
        required: true
    },
    price:{
        type: Number,
        required: true
    }
});

const TutorAvailability = mongoose.model('TutorAvailability', tutorAvailabilitySchema);

module.exports = TutorAvailability;
