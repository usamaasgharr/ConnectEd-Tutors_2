
const User = require("../models/user");
const jwt = require('jsonwebtoken')


const getSearchResult = async (req, res, next) => {

    const { role, search_query, subject, country, city } = req.query
    // Construct the base query
    let query = {};

    // Add role filter if role is specified and not 'all'
    if (role && role !== 'all') {
        query.role = role;
    }

    // Add subject filter if subject is specified and not 'all'
    if (subject && subject !== 'all') {
        query["profile.subjects"] = subject;
    }

    // Add search_query filter if search_query is specified
    if (search_query) {
        query.$or = [
            { 'username': { $regex: new RegExp(search_query, 'i') } },
            { 'profile.firstName': { $regex: new RegExp(search_query, 'i') } },
            { 'profile.lastName': { $regex: new RegExp(search_query, 'i') } },
            { 'profile.subjects': { $regex: new RegExp(search_query, 'i') } }
        ];
    }


    // Add country filter if country is specified
    if (country && country !== 'all') {
        query["profile.location.country"] = { $regex: new RegExp(country, 'i') };
    }

    // Add city filter if city is specified
    if (city && city !== 'all') {
        query["profile.location.city"] = { $regex: new RegExp(city, 'i') };
    }

    query["isActive"] = true;
    query["role"] = 'teacher';
    // Execute the query using your MongoDB driver
    try {
        const data = await User.find(query, { profile: 1, username: 1, email: 1 });
        const profiles = await User.find({}, { profile: 1 });
        const subjects = [];
        profiles.forEach(item => {
            item.profile.subjects.forEach(subject => {
                if (!subjects.includes(subject)) {
                    subjects.push(subject)
                }
            })
        })

        const countrys = [];
        profiles.forEach(item => {
            if (!countrys.includes(item.profile.location.country)) {
                countrys.push(item.profile.location.country)
            }
        })

        const token = req.cookies.token;
        let user = {};
        if (token) {
            const secretKey = 'your-secret-key';
            const decoded = jwt.verify(token, secretKey);
            user.profile = decoded.profile;
            user.email = decoded.email;
            user.username = decoded.username;
            
        }else{
            user = null;
        }

        res.render('instructors-list', { data, subjects, countrys, title: '', user })

    } catch (err) {
        console.error('Error fetching data from MongoDB:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}



const getUserProfile = async (req, res) => {
    try {

        const { userId } = req.query;

        if (!userId) {
            return res.status(400).json({ message: 'userId is required in the request body' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ user });
    } catch (error) {
        // Handle errors
        console.error('Error fetching user data:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = { getSearchResult, getUserProfile };