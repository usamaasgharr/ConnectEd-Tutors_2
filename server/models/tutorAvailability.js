// models/TutorAvailability.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tutorAvailabilitySchema = new Schema({
    tutor: {
        type: Schema.Types.ObjectId,
        ref: 'Tutor',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    start_time: {
        type: String, // or Date if you want to store time in ISO format
        required: true
    },
    end_time: {
        type: String, // or Date if you want to store time in ISO format
        required: true
    }
});

const TutorAvailability = mongoose.model('TutorAvailability', tutorAvailabilitySchema);

module.exports = TutorAvailability;
