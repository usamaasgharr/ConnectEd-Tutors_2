const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'userDatas', // Reference to the student who wrote the review
        required: true
    },
    tutor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'userDatas', // Reference to the tutor being reviewed
        required: true
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    comment: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
