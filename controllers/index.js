

const User = require("../models/user");


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
const aboutRoute = (req, res) =>{
    res.render('about');
}


// contact Route
const contactRoute = (req, res) =>{
    res.render('contact-us');
}

module.exports = {getUserProfile, aboutRoute, contactRoute};