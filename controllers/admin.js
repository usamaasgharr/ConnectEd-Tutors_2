
const Admin = require('../models/admin')
const User = require('../models/user')

const bcrypt = require('bcryptjs')

// tutor profile approval
// Contact us
// application Feedback


const addNewAdmin = async (req, res) => {

    try {

        const { username, email, password } = req.body;

        const existingUsername = await Admin.findOne({ username });
        if (existingUsername) {
            return res.status(400).json({ message: 'User with this username already exists' });
        }


        const existingEmail = await Admin.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const admin = new Admin({
            username,
            email,
            password: hashedPassword,
        });


        // Save user to database
        await admin.save();

        res.status(201).json({ message: 'User registered successfully' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};




const deleteUserAccount = async (req, res) => {
    try {
        const { username } = req.params;

        const user = await User.findOneAndDelete({username});

        // If the user with the given userId does not exist, return an error
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User account deleted successfully' });
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
const toggleUserStatus = async (req, res) => {
    try {
        const { username } = req.params;
        const { active } = req.body; 

        const user = await User.findOne({username});

        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        user.isActive = active;

        await user.save();

        res.status(200).json({ message: `User account ${active ? 'activated' : 'deactivated'} successfully` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


const AdminloginView = async (req, res) => {
    res.render('admin/login')
        
};




module.exports = { addNewAdmin, deleteUserAccount, searchUser, toggleUserStatus, AdminloginView }
