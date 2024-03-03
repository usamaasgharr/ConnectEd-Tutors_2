// User Schema (server/models/User.js)

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['student', 'teacher', 'admin'],
        default: 'student'
    },
    profile: {
        firstName: String,
        lastName: String,
        education: String,
        bio: String,
        subjects: [{ type: String }],
        location: {
            country: { type: String },
            city: { type: String }
        },
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
});

const User = mongoose.model('usersData', userSchema);

module.exports = User;
