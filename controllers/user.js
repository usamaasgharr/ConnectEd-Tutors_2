const User = require("../models/user");
const fs = require('fs');
const jwt = require('jsonwebtoken')
const TutorAvailability = require('../models/TutorAvailability');
const bookedSession = require('../models/bookedSessions')
const TeacherStudent = require('../models/teachersAllStudents')
const Review = require('../models/reviews')
const Chat = require("../models/chat");

const mongoose = require('mongoose');
const { profile } = require("console");
const { ObjectId } = mongoose.Types;



// Get user profile
const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId, 'profile email username');

        if (!user) {
            return res.status(404).json({ message: 'User not Found' });
        }
        const role = req.user.role;
        res.status(200).render('edit-profile', { user, role, title: 'editProfile' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Update user profile including profile picture upload
const updateProfile = async (req, res) => {
    try {

        const { firstName, lastName, education, bio, subjects, city, country, title } = req.body;

        const user = await User.findById(req.user.userId, 'profile email username');

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
        const users = await User.findOne({ username: username });
        
        if (!users) {
            return res.status(404).send('User not found');
        }

        const reviews = await Review.find({ tutor: users._id });


        if (!reviews) {
            reviews = [];
        }

        let review = [];

        // Use map to create an array of promises
        const reviewPromises = reviews.map(async item => {
            const studentDetails = await User.findById(item.student, { profile: 1, username: 1 });
            return { studentDetails, item };
        });

        // Wait for all promises to resolve using Promise.all
        const reviewResults = await Promise.all(reviewPromises);

        // Populate session array with results
        review = reviewResults.map(result => ({ studentDetails: result.studentDetails, Review: result.item }));





        const sessions = await TutorAvailability.find({ tutor: users._id });
        

        if (!sessions) {
            return res.status(404).send('No sessions Added.');
        }

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

        // Render the user profile page with the retrieved user data
        res.render('instructor-details', { users, sessions, review, title: "", user });
    } catch (err) {
        console.error('Error fetching user data:', err);
        res.status(500).send('Internal server error');
    }
};

// display dashboard on successfult login
const dashboard = async (req, res, next) => {

    const user = await User.findById(req.user.userId, 'profile email username');

    const role = req.user.role;
    let sessions = {}

    if (role === 'teacher') {
        sessions = await TutorAvailability.find({ tutor: req.user.userId });
        const currentDate = new Date().getDate();
        const currentHour = new Date().getHours();
        // const currentMonth = new Date().getMonth() + 1;
        const currentMinute = new Date().getMinutes();


        res.render('dashboard', { user, role, sessions, currentHour, currentMinute, currentDate, title: "dashboard" });
    } else {
        let session = await bookedSession.find({ student: req.user.userId });

        let sessionss = [];

        // Use map to create an array of promises
        const sessionPromises = session.map(async item => {
            const sessionDetail = await TutorAvailability.findById(item.session);
            const TutorDetails = await User.findById(item.tutor, { username: 1 });
            return { TutorDetails, sessionDetail };
        });


        const sessionResults = await Promise.all(sessionPromises);

        sessions = sessionResults.map(result => ({ TutorDetails: result.TutorDetails, sessionDetail: result.sessionDetail }));
        res.render('dashboard', { user, role, sessions });
    }
    if (!user) {
        console.log('User Not Found');
        res.redirect('/login')
    }




}


//chats
const chats = async (req, res, next) => {

    const user = await User.findById(req.user.userId, 'profile email username');
    if (!user) {
        console.log('User Not Found');
        res.redirect('/login')
    }

    const receiver = req.query.receiver;
    let chats = []
    let receiverProfile = '';
    if (receiver) {

        chats = await Chat.find({
            $or: [
                { sender: req.user.userId, receiverId: receiver },
                { sender: receiver, receiverId: req.user.userId }
            ]
        })
        receiverProfile = await User.findById(receiver, { profile: 1 })

    } else {
        chats = [];
        receiverProfile = null
    }
    // console.log(chats)
    const usersChat = await Chat.find({
        $or: [
            { sender: req.user.userId },
            { receiverId: req.user.userId }
        ]
    })

    const users = [];
    usersChat.forEach(item => {
        if (!(users.includes(item.sender)) && item.sender != req.user.userId) {
            users.push(item.sender);
        }
        if (!(users.includes(item.receiverId)) && item.receiverId != req.user.userId) {
            users.push(item.receiverId);
        }
    })


    const stringArray = users.map(user => user.toString());
    const uniqueStringArray = [...new Set(stringArray)];

    const allUsers = uniqueStringArray.map(str => new ObjectId(str));

    const chatUsersPromises = allUsers.map(item => {
        return User.findById(item, 'profile');
    });

    Promise.all(chatUsersPromises)
        .then(chatUsers => {
            // `chatUsers` will be an array of profiles
            // console.log(chatUsers);
            const role = req.user.role;
            res.render('chats', { user, role, chats, userId: req.user.userId, receiverId: receiver, chatUsers, receiverProfile, title: 'chats' });
        })
        .catch(err => {
            console.error('Error:', err);
        });

}

const saveChats = async (req, res, next) => {

    try {
        const { message, receiverId } = req.body;
        const sender = await User.findById(req.user.userId, 'username');

        const newMessage = new Chat({
            sender: sender,
            receiverId,
            message,
        });

        await newMessage.save();
        console.log("saved;")

    } catch (error) {
        console.log(error)
        res.status(500).send("An error occurred while adding the session.");
    }





}

// sessions 
const addSessions = async (req, res, next) => {
    const user = await User.findById(req.user.userId, 'profile email username');

    if (!user) {
        console.log('User Not Found');
        res.redirect('/login')
    }

    const role = req.user.role;
    res.render('addSessions', { user, role, title: 'addSessions' })
}

const createSession = async (req, res, next) => {
    try {
        // Extract data from the request body
        const { start_time, end_time, date, price } = req.body;
        // Create a new TutorAvailability object
        const newSession = new TutorAvailability({
            tutor: req.user.userId, // Assuming req.user contains the logged-in user's data
            date,
            start_time,
            end_time,
            price
        });

        // Save the new session to the database
        await newSession.save();


        // Redirect the user or send a response indicating success
        res.redirect('/user/dashboard');
    } catch (error) {
        // Handle errors
        console.error("Error adding session:", error);
        res.status(500).send("An error occurred while adding the session.");
    }
}

// deleet Sessions
const deleteSession = async (req, res, next) => {

    const deletedSession = await TutorAvailability.findByIdAndDelete(req.body.sessionId);
    const deletedFromBookedSession = await bookedSession.deleteOne({ session: req.body.sessionId });

    if (!deletedSession) {
        return res.status(404).json({ message: 'Session not found' });
    }

    res.redirect('/user/dashboard');
}

// edit Session
const editSession = async (req, res, next) => {
    const session = await TutorAvailability.findById(req.query.sessionId);

    if (!session) {
        return res.status(404).json({ message: 'Session not found' });
    }

    const user = await User.findById(req.user.userId, 'profile email username');

    if (!user) {
        console.log('User Not Found');
        res.redirect('/login')
    }

    const role = req.user.role;
    res.render('edit-session', { user, role, session, title: '' })
}
// update Session in data base
const updateSession = async (req, res, next) => {
    try {
        const { start_time, end_time, price, date } = req.body;
        console.log(start_time, end_time, price, date);

        const session = await TutorAvailability.findById(req.body.sessionId)


        if (!session) {
            return res.status(404).json({ message: 'Session not found' });
        }

        session.start_time = start_time || session.start_time;
        session.end_time = end_time || session.end_time;
        session.date = date || session.date;
        session.price = price || session.price;

        await session.save();

        res.redirect('/user/dashboard')
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

// Book Session

const bookSession = async (req, res, next) => {
    try {

        const { sessionId } = req.query;

        const session = await TutorAvailability.findById(sessionId)
        const tutorId = session.tutor;
        const tutor = await User.findById(tutorId, { profile: 1 });


        if (!session) {
            return res.status(404).json({ message: 'Session not found' });
        }
        const stripe_public_key = process.env.STRIPE_PUBLIC_KEY;

        res.render('payment', { session, tutor, stripe_public_key, sessionId, tutorId, message: "" })

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}


// process transcation


// const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY);

// const process_transcation = async (req, res) => {
//     try {
//         const { amount } = req.body;

//         // Create a PaymentIntent using test parameters
//         const paymentIntent = await stripe.paymentIntents.create({
//             amount,
//             currency: 'usd',
//             payment_method_types: ['card'],
//             payment_method_data: {
//                 type: 'card',
//                 card: {
//                     number: '4242424242424242', // Test card number
//                     exp_month: 12,
//                     exp_year: 2024,
//                     cvc: '123'
//                 }
//             },
//             confirm: true // Confirm the payment immediately
//         });

//         // Handle successful payment (update database, send confirmation email, etc.)
//         // Redirect or respond with a success message
//         res.send('Payment successful');
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('Payment failed');
//     }
// }

// Import necessary modules
// Import necessary modules
const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY);

const processPayment = async (req, res, next) => {
    try {
        const { token, amount, cardholder_name, expiry_date, cvv, sessionId } = req.body;
        const student = req.user.userId;
        const { tutor } = req.body;


        // making transcation
        // /////////////////////////////////////////////////////////////////////
        const charge = await stripe.charges.create({
            amount: amount * 100,
            currency: 'pkr',
            source: token,
            description: 'Payment for tutoring session',
            statement_descriptor: 'Tutoring Session',
            metadata: {

            },
        });

        console.log('Payment successful:');

        // update the session status
        // /////////////////////////////////////////////////////////////////////////

        const session = await TutorAvailability.findOneAndUpdate(
            { _id: sessionId },
            { $set: { isAvailable: false } },
            { new: true }
        );

        console.log('update successful:');

        // ///////////////////////////////////////////////////////////////////////
        // add session to booked sessions data

        const bookedSessions = new bookedSession({
            tutor,
            student: req.user.userId,
            session: sessionId
        });
        await bookedSessions.save();

        console.log('Booked successful:');

        // ///////////////////////////////////////////////////////////////
        // add this student to teachers "student's data"

        const existingData = await TeacherStudent.findOne({ tutor: tutor });

        if (existingData) {
            existingData.students.push(student);
            await existingData.save();
        } else {
            const teacherStudent = new TeacherStudent({
                tutor,
                students: student
            });
            await teacherStudent.save();
        }

        res.render('payment-status', { message: "Payment Sucessfull. Session Booked" });
    } catch (error) {

        console.error('Payment failed:', error);
        res.render('payment-status', { message: "Payment Failed." });
    }
};



// /////////////////////////////////
const allStudents = async (req, res, next) => {
    try {
        const tutor = req.user.userId;
        const Sstudents = await TeacherStudent.findOne({ tutor }, { students: 1 });
        let studentsData = [];
        if (Sstudents) {
            const students = Sstudents.students;

            studentsData = await User.find({ _id: { $in: students } }, { profile: 1, username: 1 });

        } else {
            studentsData = [];
        }



        const user = await User.findById(req.user.userId, 'profile email username');

        if (!user) {
            console.log('User Not Found');
            res.redirect('/login')
        }

        const role = req.user.role;


        res.render('ins-students', { studentsData, user, role, title: 'students' })

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

const activeSessions = async (req, res, next) => {
    try {
        const tutor = req.user.userId;
        const sessions = await bookedSession.find({ tutor });
        let session = [];

        // Use map to create an array of promises
        const sessionPromises = sessions.map(async item => {
            const sessionDetail = await TutorAvailability.findById(item.session);
            const studentDetails = await User.findById(item.student, { profile: 1, username: 1 });
            return { studentDetails, sessionDetail };
        });

        // Wait for all promises to resolve using Promise.all
        const sessionResults = await Promise.all(sessionPromises);

        // Populate session array with results
        session = sessionResults.map(result => ({ studentDetails: result.studentDetails, sessionDetail: result.sessionDetail }));

        const user = await User.findById(req.user.userId, 'profile email username');

        if (!user) {
            console.log('User Not Found');
            return res.redirect('/login');
        }

        const role = req.user.role;

        // res.json(session);
        res.render('bookedSessions', { user, role, session, title: 'bSessions' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

// //////////////////////////////////////////  reviews

const insReviews = async (req, res) => {

    const reviews = await Review.find({ tutor: req.user.userId });


    if (!reviews) {
        reviews = [];
    }

    let review = [];

    // Use map to create an array of promises
    const reviewPromises = reviews.map(async item => {
        const studentDetails = await User.findById(item.student, { profile: 1, username: 1 });
        return { studentDetails, item };
    });

    // Wait for all promises to resolve using Promise.all
    const reviewResults = await Promise.all(reviewPromises);

    // Populate session array with results
    review = reviewResults.map(result => ({ studentDetails: result.studentDetails, Review: result.item }));


    const user = await User.findById(req.user.userId, 'profile email username');



    if (!user) {
        console.log('User Not Found');
        res.redirect('/login')
    }

    const role = req.user.role
    res.render('instructor-reviews', { user, role, review, title: "reviews" });
}


const add_review = async (req, res) => {

    const _id = req.user.userId;

    const tutors = await TeacherStudent.find({ students: { $in: _id } }, { tutor: 1 });

    const sessionPromises = tutors.map(async tutor => {
        const tutorUsername = await User.findById(tutor.tutor, { username: 1 });
        return tutorUsername;
    });

    // Wait for all promises to resolve using Promise.all
    const usernames = await Promise.all(sessionPromises);

    const user = await User.findById(req.user.userId, 'profile email username');

    if (!user) {
        console.log('User Not Found');
        res.redirect('/login')
    }

    const role = req.user.role
    res.render('add-review', { user, role, usernames , title: "giveReview"});
}

// /
const post_review = async (req, res) => {
    try {
        const { student, comment, rating, tutor } = req.body;


        const ratings = parseInt(rating[0]);

        const tutorId = await User.findOne({ username: tutor }, { _id: 1 });

        console.log(tutorId)

        // Create a new review object
        const newReview = new Review({
            student: student,
            tutor: tutorId,
            comment: comment,
            rating: ratings
        });

        // Save the review to the database
        const savedReview = await newReview.save();

        // Respond with a success message
        res.status(201).json({ message: 'Review posted successfully', review: savedReview });
    } catch (error) {
        // Handle any errors
        console.error('Error posting review:');
        res.status(500).json({ message: 'Failed to post review' });
    }
};



// deleteAccount
const deleteAccount = async (req, res, next) => {
    const user = await User.findById(req.user.userId, 'profile email username');


    if (!user) {
        console.log('User Not Found');
        res.redirect('./login')
    }

    const role = req.user.role;
    res.render('delete-account', { user, role , title: 'deleteProfile'})
}

const accountDelete = async (req, res, next) => {
    try {
        // Assuming req.user.userId contains the ID of the user to be deleted
        const deletedUser = await User.findByIdAndUpdate(req.user.userId, { isActive: null });

        // const deletedUser = await User.findByIdAndDelete(req.user.userId);

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

module.exports = { getProfile, updateProfile, renderUserProfilePage, dashboard, deleteAccount, accountDelete, chats, addSessions, createSession, deleteSession, editSession, updateSession, bookSession, processPayment, allStudents, activeSessions, insReviews, add_review, post_review, saveChats };
