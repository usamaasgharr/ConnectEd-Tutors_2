const User = require("../models/user");
const fs = require('fs');

// Get user profile
const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId, { 'profile': 1 });

        if (!user) {
            return res.status(404).json({ message: 'User not Found' });
        }

        res.status(200).json({ user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Update user profile including profile picture upload
const updateProfile = async (req, res) => {
    try {
        const { firstName, lastName, education, bio, subjects, location } = req.body;
        const { profilePicture } = req.files; // Assuming the profile picture is uploaded as 'profilePicture'

        const user = await User.findById(req.user.userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Updating the user profile
        user.profile.firstName = firstName || user.profile.firstName;
        user.profile.lastName = lastName || user.profile.lastName;
        user.profile.education = education || user.profile.education;
        user.profile.bio = bio || user.profile.bio;
        user.profile.subjects = subjects || user.profile.subjects;
        user.profile.location = location || user.profile.location;

        // Update profile picture if provided
        if (profilePicture) {
            user.profile.profilePicture.data = fs.readFileSync(profilePicture.path);
            user.profile.profilePicture.contentType = profilePicture.mimetype;
        }

        await user.save();

        res.status(200).json({ message: 'User profile updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = { getProfile, updateProfile };
