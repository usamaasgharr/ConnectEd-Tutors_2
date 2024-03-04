// auth.js (server/controllers/auth.js)

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
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

            console.log(req.body)
            console.log(req.file)
            // Extract user data from request body
            const { username, email, password, role,firstName, lastName, education, bio, subjects, location  } = req.body;

            // Save profile picture file name to profile.profilePicture
            let profilePicture = null; // Initialize profilePicture
            if (req.file) {
                profilePicture = req.file.filename;
            }

            // Create new user instance
            const user = new User({
                username,
                email,
                password,
                role,
                profile: {
                    firstName,
                    lastName,
                    education,
                    bio,
                    subjects,
                    location,
                    profilePicture // Assign profile picture
                }
            });
            
            // Save user to database
            await user.save();

            res.status(201).json({ message: 'User registered successfully' });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


// const signup = async (req, res) => {
//     try {
//         console.log(req.body);
//         console.log(req.file);

//         // Validate request body
//         const errors = validationResult(req);
//         if (!errors.isEmpty()) {
//             return res.status(400).json({ errors: errors.array() });
//         }  

//         const { username, email, password, role, profile: { firstName, lastName, education, bio, subjects, location, profilePicture } } = req.body;
//         // checking if user with this email already exists

//         let user = await User.findOne({ email });
//         if (user) {
//             return res.status(400).json({ message: 'User with this email already exists' });
//         }
//         // Hash the password
//         const hashedPassword = await bcrypt.hash(password, 10);

//         user = new User({
//             username,
//             email,
//             password: hashedPassword,
//             role,
//             profile: {
//                 firstName,
//                 lastName,
//                 education,
//                 bio,
//                 subjects,
//                 location,
//                 profilePicture // Add profile picture to the profile
//             }
//         });

//         // Save the user to the database
//         await user.save();
//         res.status(201).json({ message: 'User registered successfully' });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// };


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


