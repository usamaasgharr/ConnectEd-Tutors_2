// controllers/tutorAvailabilityController.js

const TutorAvailability = require('../models/tutorAvailability');

// Create a new availability slot for a tutor
const createAvailability = async (req, res) => {
    try {
        const { tutor, date, start_time, end_time } = req.body;
        const newAvailability = new TutorAvailability({
            tutor,
            date,
            start_time,
            end_time
        });
        await newAvailability.save();
        res.status(201).json(newAvailability);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Update an existing availability slot
const updateAvailability = async (req, res) => {
    try {
        const { id } = req.params;
        const { date, start_time, end_time } = req.body;
        const updatedAvailability = await TutorAvailability.findByIdAndUpdate(id, { date, start_time, end_time }, { new: true });
        res.status(200).json(updatedAvailability);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Delete an availability slot
const deleteAvailability = async (req, res) => {
    try {
        const { id } = req.params;
        await TutorAvailability.findByIdAndDelete(id);
        res.status(200).json({ message: 'Availability slot deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Retrieve available slots for a tutor based on a given date range
const getAvailability = async (req, res) => {
    try {
        const { tutor, start_date, end_date } = req.query;
        const availability = await TutorAvailability.find({ tutor, date: { $gte: start_date, $lte: end_date } });
        res.status(200).json(availability);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = { createAvailability, updateAvailability, deleteAvailability, getAvailability };
