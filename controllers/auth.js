// auth.js (server/controllers/auth.js)

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Admin = require('../models/admin')
const { validationResult } = require('express-validator');

const multer = require('multer');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = './uploads';
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath);
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});

// Multer file filter
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('File type not supported. Only images are allowed.'), false);
    }
};

// Multer instance
const upload = multer({
    storage,
    fileFilter,
});

// Upload profile picture
const uploadProfilePicture = upload.single('profile.profilePicture');

const signup = async (req, res) => {

    try {
        // Handle profile picture upload
        uploadProfilePicture(req, res, async (err) => {
            if (err) {
                return res.status(400).json({ message: err.message });
            }

            // Extract user data from request body
            const { username, email, password, role, firstName, lastName, education, bio, subjects, country, city, title } = req.body;
            const existingUsername = await User.findOne({ username });
            if (existingUsername) {
                return res.status(400).json({ message: 'User with this username already exists' });
            }

            const existingEmail = await User.findOne({ email });
            if (existingEmail) {
                return res.status(400).json({ message: 'User with this email already exists' });
            }

            let profilePicture = null;
            if (req.file) {
                profilePicture = req.file.filename;
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            // Create new user instance
            const user = new User({
                username,
                email,
                password: hashedPassword,
                role,
                profile: {
                    firstName,
                    lastName,
                    education,
                    bio,
                    subjects,
                    location: { country, city },
                    title,
                    profilePicture // Assign profile picture
                }
            });

            // Save user to database
            await user.save();
            res.redirect('/login');


        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};




// ---------------------------------------login function------------------------------

const login = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // return res.status(400).json({ errors: errors.errors[0].msg });
            return res.render('sign-in', { errorMessage: errors.errors[0].msg });

        }


        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            // return res.status(401).json({ message: 'Invalid credentials' });
            return res.render('sign-in', { errorMessage: "Invalid Crediantials " });
        }


        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.render('sign-in', { errorMessage: 'Invalid username or password' });
        }
        const token = jwt.sign({ userId: user._id, email: user.email, role: user.role }, 'your-secret-key', { expiresIn: '12000hr' });

        res.cookie('token', token, { httpOnly: true });
        res.redirect('/user/dashboard');


    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}


// ---------------------------------------login function------------------------------

const Adminlogin = async (req, res) => {

    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }


        const { username, password } = req.body;

        const admin = await Admin.findOne({ username });


        if (!admin) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isPasswordValid = await bcrypt.compare(password, admin.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credientials' });
        }
        const token = jwt.sign({ userId: admin._id, email: admin.email, role: admin.role }, 'your-secret-key', { expiresIn: '12000hr' });


        res.status(200).json({ token });


    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}


// signout
const signout = (req, res) => {
    try {
        // Clear the token cookie by setting its value to an empty string and expiring it
        res.cookie('token', '', { expires: new Date(0), httpOnly: true });

        // Redirect the user to the login page or any other appropriate page
        res.redirect('/login');
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}


module.exports = { signup, login, Adminlogin, signout };


