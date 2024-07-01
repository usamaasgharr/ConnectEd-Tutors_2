
const jwt = require('jsonwebtoken');
const User = require("../models/user");
const userQuerie = require('../models/queries')
const Reviews = require('../models/reviews')


const getUserProfile = async (req, res) => {
    try {

        const users = await User.find(
            { isActive: true, role: 'teacher' }
            , 'profile username');


        const token = req.cookies.token;
        let user = {};
        if (token) {
            const secretKey = 'your-secret-key';
            const decoded = jwt.verify(token, secretKey);
            user.profile = decoded.profile;
            user.email = decoded.email;
            user.username = decoded.username;

        } else {
            user = null;
        }

        let ratings = [];
        for (let i in users) {
            
            let rate = await Reviews.find({ tutor: users[i]._id })
            
            let sum = 0;
            if (rate.length > 0) {
                for (let j in rate) {
                    sum += rate[j].rating;
                }
                sum = Math.round(sum / rate.length);
                ratings.push({ rating: sum, id: users[i]._id });
            } else {
                ratings.push({ rating: sum, id: users[i]._id });
            }

        }


        res.render('index-3', { users, title: 'home', user, ratings });
    } catch (error) {
        // Handle errors
        console.error('Error fetching user data:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}


// contact Route
const aboutRoute = (req, res) => {
    let user = {};
    const token = req.cookies.token;
    if (token) {
        const secretKey = 'your-secret-key';
        const decoded = jwt.verify(token, secretKey);
        user.profile = decoded.profile;
        user.email = decoded.email;
        user.username = decoded.username;

    } else {
        user = null;
    }

    res.render('about', { title: 'about', user });
}


// contact Route
const contactRoute = (req, res) => {
    let user = {};
    const token = req.cookies.token;
    if (token) {
        const secretKey = 'your-secret-key';
        const decoded = jwt.verify(token, secretKey);
        user.profile = decoded.profile;
        user.email = decoded.email;
        user.username = decoded.username;

    } else {
        user = null;
    }

    res.render('contact-us', { message: "", title: "contact", user });
}

// 
const contactform = async (req, res) => {
    try {
        const { name, email, message } = req.body;

        const newQuery = new userQuerie({
            name,
            email,
            message,
        });

        // Save the new session to the database
        await newQuery.save();

        let user = {};
        const token = req.cookies.token;
        if (token) {
            const secretKey = 'your-secret-key';
            const decoded = jwt.verify(token, secretKey);
            user.profile = decoded.profile;
            user.email = decoded.email;
            user.username = decoded.username;
    
        } else {
            user = null;
        }


        res.render('contact-us', { message: "Form Submitted.", title: 'contact', user })
    } catch (error) {
        console.error("Error submitting contact form:", error);
        res.status(500).json({ message: "Internal server error." });
    }

}

module.exports = { getUserProfile, aboutRoute, contactRoute, contactform };