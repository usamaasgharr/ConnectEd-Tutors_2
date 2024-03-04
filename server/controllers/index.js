

const User = require("../models/user");


const getUserProfile = async (req, res) => {
    try {

        const users = await User.find({ isActive: true });
        if (!users) {
            return res.status(404).json({ message: 'No users in DB' });
        }

        res.json({ users });
    } catch (error) {
        // Handle errors
        console.error('Error fetching user data:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports =  getUserProfile ;