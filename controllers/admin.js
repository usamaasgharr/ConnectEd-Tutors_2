
const Admin = require('../models/admin')
const User = require('../models/user')

const bcrypt = require('bcryptjs')



const addNewAdmin_View = async (req, res) => {
    res.render('admin/add-new-admin', { errorMessage: '' })
}

const addNewAdmin = async (req, res) => {

    try {

        const { username, email, password } = req.body;

        const existingUsername = await Admin.findOne({ username });
        if (existingUsername) {
            return res.status(400).render('admin/add-new-admin', { errorMessage: 'User with This username Already Exixt' });
        }


        const existingEmail = await Admin.findOne({ email });
        if (existingEmail) {
            return res.status(400).render('admin/add-new-admin', { errorMessage: 'User with This Email Already Exixt' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const admin = new Admin({
            username,
            email,
            password: hashedPassword,
        });


        // Save user to database
        await admin.save();

        return res.status(201).render('admin/add-new-admin', { errorMessage: 'User Registered Sucessfully' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


const deleteUserAccount_View = async (req, res) => {
    res.render('admin/delete-user-account', { errorMessage: '' })
}


const deleteUserAccount = async (req, res) => {
    try {
        const { username } = req.body;
        const user = await User.findOneAndDelete({ username });

        // If the user with the given userId does not exist, return an error
        if (!user) {
            return res.status(404).render('admin/delete-user-account', { errorMessage: 'No user exixt With this username' })
        }

        return res.status(404).render('admin/delete-user-account', { errorMessage: 'Account Deleted Sucessfully' })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


// search /can get all user list

const searchUser = async (req, res) => {
    try {
        const { search_query } = req.query;

        const users = await User.find({
            $or: [
                { username: { $regex: new RegExp(search_query, 'i') } },
                { email: { $regex: new RegExp(search_query, 'i') } }
            ]
        });

        console.log(users);

        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// activate or deactivate user Account
const toggleUserStatus_View = async (req, res) => {
    res.render('admin/toggle-status', { errorMessage: "" })
}


const toggleUserStatus = async (req, res) => {
    try {
        const { username, active } = req.body;

        console.log(active);

        const user = await User.findOne({ username });


        if (!user) {
            return res.status(404).render('admin/toggle-status',{ errorMessage: 'User not found' });
        }
        
        user.isActive = active;

        await user.save();

        res.status(201).render('admin/toggle-status', {
            errorMessage: `Account Status Toggled Successfully`
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


const AdminloginPage = async (req, res) => {
    res.render('admin/login', { errorMessage: null })
};

const dashboard = async (req, res) => {
    res.render('admin/adminPanel')

};




module.exports = { addNewAdmin, deleteUserAccount, searchUser, toggleUserStatus, AdminloginPage, dashboard, addNewAdmin_View, deleteUserAccount_View, toggleUserStatus_View }
