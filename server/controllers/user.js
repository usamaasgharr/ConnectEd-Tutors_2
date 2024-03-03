

const User = require("../models/user");

const getProfile = async (req, res) => {
    try {

        const user = await User.findById(req.user.userId, { 'profile': 1 });

        if (!user) {
            return res.status(404).json({ message: 'User not Found' });
        }

        res.status(200).json({ user });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' })
    }
};

// Update user profile

const updateProfile = async (req, res) => {
    try {
        const { firstName, lastName, education, bio, subjects, location } = req.body;

        const user = await User.findById(req.user.userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Updating the user profile
        // Update profile fields
        user.profile.firstName = firstName || user.profile.firstName;
        user.profile.lastName = lastName || user.profile.lastName;
        user.profile.education = education || user.profile.education;
        user.profile.bio = bio || user.profile.bio;
        user.profile.subjects = subjects || user.profile.subjects;
        user.profile.location = location || user.profile.location;


        await user.save();

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' })
    }
};






module.exports = { getProfile, updateProfile };

