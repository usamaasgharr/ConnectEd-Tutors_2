
const { body } = require('express-validator');


// Validation for signup
exports.signupValidation = [
  body('username').trim().notEmpty().withMessage('Username is required'),
  body('email').trim().isEmail().withMessage('Invalid email format'),
  body('password').trim().isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),

  
];

// Validation for login
exports.loginValidation = [
  body('email').trim().isEmail().withMessage('Invalid email format'),
  body('password').trim().notEmpty().withMessage('Password is required'),
];
