const express = require('express');
const router = express.Router();
const tutorAvailabilityController = require('../controllers/tutorAvailabilityController');
const authMiddleware = require('../middleware/auth')

// Create a new availability slot for a tutor
router.post('/tutor-availability', authMiddleware, tutorAvailabilityController.createAvailability);

// Update an existing availability slot
router.put('/tutor-availability/:id', authMiddleware, tutorAvailabilityController.updateAvailability);

// Delete an availability slot
router.delete('/tutor-availability/:id',authMiddleware, tutorAvailabilityController.deleteAvailability);

// Retrieve available slots for a tutor based on a given date range
router.get('/tutor-availability', authMiddleware ,tutorAvailabilityController.getAvailability);

module.exports = router;