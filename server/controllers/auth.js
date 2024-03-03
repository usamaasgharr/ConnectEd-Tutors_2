// auth.js (server/controllers/auth.js)

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { validationResult } = require('express-validator');


const signup = async (req, res) => {

    try {
        // Validate request body
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { username, email, password, role, profile: { firstName, lastName, education, bio, subjects, location } } = req.body;
        // checking if user with this email already exixts
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        user = new User({
            username,
            email,
            password: hashedPassword,
            role,
            profile:
            {
                firstName,
                lastName,
                education,
                bio,
                subjects,
                location
            }
        });
        // Save the user to the database
        await user.save().
            then(savedUser => {
                console.log('User saved:', savedUser);
                res.status(201).json({ message: 'User registered successfully' });
            })
            .catch(error => {
                console.error('Error saving user:', error);
                res.status(201).json({ message: 'Error saving User :', error });
            });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


// ---------------------------------------login function------------------------------

const login = async (req, res) => {

    try {
        // Validate request body
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // Extract user data from request body
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Check if the provided password is correct
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credientials' });
        }

        // generate JWT Token
        const token = jwt.sign({ userId: user._id, email: user.email, role: user.role }, 'your-secret-key', { expiresIn: '12000hr' });
        // res.status(200).json({ token, userId: user._id, username: user.username, role: user.role });
        console.log(token)
        res.status(200).json({ token });


    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = { signup, login };

