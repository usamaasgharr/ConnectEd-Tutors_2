const express = require('express');
const { signupValidation, loginValidation } = require('../middleware/validation');
const authController = require('../controllers/auth');


const router = express.Router();

// Signup route
router.post('/signup', signupValidation, authController.signup);

// login route
router.post('/login', loginValidation, authController.login)

module.exports = router;
