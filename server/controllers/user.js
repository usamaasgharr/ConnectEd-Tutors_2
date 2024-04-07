const User = require("../models/user");
const fs = require('fs');

// Get user profile
const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId, { 'profile': 1 });

        if (!user) {
            return res.status(404).json({ message: 'User not Found' });
        }
        const role = req.user.role;
        res.status(200).render('edit-profile', { user, role });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Update user profile including profile picture upload
const updateProfile = async (req, res) => {
    try {

        console.log(req.query);
        const { firstName, lastName, education, bio, subjects, city, country, title } = req.body;

        const user = await User.findById(req.user.userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Updating the user profile
        user.profile.firstName = firstName || user.profile.firstName;
        user.profile.lastName = lastName || user.profile.lastName;
        user.profile.education = education || user.profile.education;
        user.profile.title = title || user.profile.title;
        user.profile.bio = bio || user.profile.bio;
        user.profile.subjects = subjects || user.profile.subjects;
        user.profile.location.city = city || user.profile.location.city;
        user.profile.location.country = country || user.profile.location.country;


        await user.save();

        res.status(200).json({ message: 'User profile updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};



// render user profile
const renderUserProfilePage = async (req, res, next) => {

    const username = req.params.username;


    try {
        const user = await User.findOne({ username: username });

        if (!user) {
            return res.status(404).send('User not found');
        }

        // Render the user profile page with the retrieved user data
        res.render('instructor-details', { user });
    } catch (err) {
        console.error('Error fetching user data:', err);
        res.status(500).send('Internal server error');
    }
};

// display dashboard on successfult login
const dashboard = async (req, res, next) => {

    const user = await User.findById(req.user.userId, 'profile');

    if (!user) {
        console.log('User Not Found');
        res.redirect('/login')
    }

    const role = req.user.role;
    res.render('dashboard', { user, role });

}

// deleteAccount
const deleteAccount = async (req, res, next) => {
    const user = await User.findById(req.user.userId, 'profile');

    if (!user) {
        console.log('User Not Found');
        res.redirect('./login')
    }

    const role = req.user.role;
    res.render('delete-account', { user, role })
}

const accountDelete = async (req, res, next) => {
    try {
        // Assuming req.user.userId contains the ID of the user to be deleted
        const deletedUser = await User.findByIdAndDelete(req.user.userId);

        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        console.log('Account Deleted , Id : ', req.user.userId);
        res.redirect('/signout')
    } catch (error) {
        console.error('Error deleting user', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = { getProfile, updateProfile, renderUserProfilePage, dashboard, deleteAccount, accountDelete };
