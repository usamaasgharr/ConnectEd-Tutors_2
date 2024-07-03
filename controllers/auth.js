// auth.js (server/controllers/auth.js)

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Request = require('../models/accountRequests')
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
    console.log(req.body)
    try {
        // Handle profile picture upload
        uploadProfilePicture(req, res, async (err) => {
            if (err) {
                return res.status(400).json({ message: err.message });
            }

            // Extract user data from request body
            const { username, email, password, role, firstName, lastName, education, bio, subjects, country, city, title } = req.body;
            const data = {};
            data.username = username;
            data.email = email;
            data.password = password;
            data.role = role;
            data.firstName = firstName;
            data.lastName= lastName;
            data.education = education;
            data.bio = bio;
            data.subjects = subjects;
            data.country = country;
            data.city = city;
            data.title = title;

            if(username.length < 5){
                return res.status(400).render('sign-up', { error: "Username must Contain at Least 5 Characters", title: '', user: null, data });
            }else if(password.length < 6){
                return res.status(400).render('sign-up', { error: "Password must Contain at Least 6 Characters", title: '', user: null , data});
            }else if(/\d/.test(firstName)){
                return res.status(400).render('sign-up', { error: "First Name should not contain any number", title: '', user: null, data });
            }
            else if(/\d/.test(lastName)){
                return res.status(400).render('sign-up', { error: "Last name should not contain any number", title: '', user: null, data });
            }
            else if(/\d/.test(country)){
                return res.status(400).render('sign-up', { error: "Country should not contain any number", title: '', user: null, data });
            }
            else if(/\d/.test(city)){
                return res.status(400).render('sign-up', { error: "City should not contain any number", title: '', user: null, data });
            }



            const existingUsername = await User.findOne({ username });
            const existingRequest = await Request.findOne({ username });

            if (existingUsername || existingRequest) {
                return res.status(400).render('sign-up', { error: "User With This Username Already Exixt.", title: '', user: null, data });
            }

            const existingEmail = await User.findOne({ email });
            const exixtingEmailRequest = await Request.findOne({ email });
            if (existingEmail || exixtingEmailRequest) {
                return res.status(400).render('sign-up', { error: "User With This Email Already Exixt.", title: '' , user: null, data });
            }

            let profilePicture = null;
            if (req.file) {
                profilePicture = req.file.filename;
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            // Create new user instance
            if (role === "student") {
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

                await user.save();
                res.redirect('/login');
            } else {
                const requests = new Request({
                    isActive: 'false',
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
                await requests.save();
                return res.status(400).render('sign-up', { error: "User Created Successfully.", title: '', user: null, data: null });
            }

            // Save user to database



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
            return res.render('sign-in', { errorMessage: errors.errors[0].msg, title: 'login', user: null });
        }

        const { email, password } = req.body;

        const check = await Request.findOne({ email })


        if (!check) {
            return res.render('sign-in', { errorMessage: 'Your Account has not been Activated Yet. Kindly Wait Untill It been Approved. ', title: 'login', user: null })
        }

        const user = await User.findOne({ email });
        if (!user) {
            // return res.status(401).json({ message: 'Invalid credentials' });
            return res.render('sign-in', { errorMessage: "Invalid Crediantials ", title: 'login' , user: null});
        }

        if (user.isActive === null) {
            return res.render('sign-in', { errorMessage: "Invalid Crediantials ", title: 'login', user: null });
        }

        if (!user.isActive) {
            return res.render('sign-in', { errorMessage: 'Your Account has been Deactivated. Kindly Contact Us through Contact us form for more Information.', title: 'login' , user: null})
        }


        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.render('sign-in', { errorMessage: 'Invalid username or password', title: 'login', user: null });
        }
        
        const token = jwt.sign({ userId: user._id, email: user.email, role: user.role, profile: user.profile, username: user.username }, 'your-secret-key', { expiresIn: '12000hr' });

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
            return res.render('admin/login', { errorMessage: "Invalid Crediantials " });
        }

        const isPasswordValid = await bcrypt.compare(password, admin.password);

        if (!isPasswordValid) {
            return res.render('admin/login', { errorMessage: "Invalid Crediantials " });
        }
        const token = jwt.sign({ userId: admin._id, role: admin.role, username }, 'your-secret-key', { expiresIn: '12000hr' });


        res.cookie('token', token, { httpOnly: true });
        res.redirect('admin/dashboard')


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


const adminSignout = (req, res) => {
    try {
        // Clear the token cookie by setting its value to an empty string and expiring it
        res.cookie('token', '', { expires: new Date(0), httpOnly: true });

        // Redirect the user to the login page or any other appropriate page
        res.redirect('/admin');
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}


module.exports = { signup, login, Adminlogin, signout, adminSignout };


