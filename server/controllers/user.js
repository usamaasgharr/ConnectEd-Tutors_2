const User = require("../models/user");
const fs = require('fs');
const TutorAvailability = require('../models/TutorAvailability');

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

        const sessions = await TutorAvailability.find({ tutor: user._id });

        if (!sessions) {
            return res.status(404).send('No sessions Added.');
        }

        // Render the user profile page with the retrieved user data
        res.render('instructor-details', { user, sessions });
    } catch (err) {
        console.error('Error fetching user data:', err);
        res.status(500).send('Internal server error');
    }
};

// display dashboard on successfult login
const dashboard = async (req, res, next) => {

    const user = await User.findById(req.user.userId, 'profile');
    const sessions = await TutorAvailability.find({ tutor: req.user.userId });
    if (!user) {
        console.log('User Not Found');
        res.redirect('/login')
    }

    const role = req.user.role;
    res.render('dashboard', { user, role, sessions });

}


//chats
const chats = async (req, res, next) => {

    const user = await User.findById(req.user.userId, 'profile');

    if (!user) {
        console.log('User Not Found');
        res.redirect('/login')
    }

    const role = req.user.role;
    res.render('chats', { user, role });

}

// sessions 
const addSessions = async (req, res, next) => {
    const user = await User.findById(req.user.userId, 'profile');

    if (!user) {
        console.log('User Not Found');
        res.redirect('/login')
    }

    const role = req.user.role;
    res.render('addSessions', { user, role })
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

    const user = await User.findById(req.user.userId, 'profile');

    if (!user) {
        console.log('User Not Found');
        res.redirect('/login')
    }

    const role = req.user.role;
    res.render('edit-session', { user, role, session })
}
// update Session in data base
const updateSession = async (req, res, next) => {
    try {

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

        const tutor = await User.findById(session.tutor._id, { profile: 1 });


        if (!session) {
            return res.status(404).json({ message: 'Session not found' });
        }
        const stripe_public_key = process.env.STRIPE_PUBLIC_KEY;

        res.render('payment', { session, tutor, stripe_public_key })

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

const processPayment = (req, res, next) => {
  const { token, amount, cardholder_name, expiry_date, cvv } = req.body;
  console.log(token);

  // Create a charge using the token and form data
  stripe.charges.create({
    amount: amount, // Amount in cents
    currency: 'usd', // Change to match your currency
    source: token, 
    description: 'Payment for tutoring session', // Customize as needed
    statement_descriptor: 'Tutoring Session',
    metadata: {
      // Add any additional metadata you want to include
    },
  })
  .then(charge => {
    // Payment successful, do something (e.g., update database, send confirmation email)
    console.log('Payment successful:', charge);
    // Optionally, you can redirect or send a success response back to the client
    res.status(200).json({ message: 'Payment successful' });
  })
  .catch(error => {
    // Payment failed, handle error
    console.error('Payment failed:', error);
    // Optionally, you can redirect or send an error response back to the client
    res.status(500).json({ message: 'Payment failed' });
  });
};

module.exports = { processPayment };


// //////////////////////////////////////////

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

module.exports = { getProfile, updateProfile, renderUserProfilePage, dashboard, deleteAccount, accountDelete, chats, addSessions, createSession, deleteSession, editSession, updateSession, bookSession, processPayment };
