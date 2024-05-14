

const User = require("../models/user");
const userQuerie = require('../models/queries')


const getUserProfile = async (req, res) => {
    try {

        const users = await User.find({ isActive: true }, 'profile username role');
        if (!users) {
            return res.status(404).json({ message: 'No users in DB' });
        }

        res.render('index-3', { users });
    } catch (error) {
        // Handle errors
        console.error('Error fetching user data:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}


// contact Route
const aboutRoute = (req, res) => {
    res.render('about');
}


// contact Route
const contactRoute = (req, res) => {
    res.render('contact-us', { message: "" });
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


        res.render('contact-us', { message: "Form Submitted." })
    } catch (error) {
        console.error("Error submitting contact form:", error);
        res.status(500).json({ message: "Internal server error." });
    }

}

module.exports = { getUserProfile, aboutRoute, contactRoute, contactform };