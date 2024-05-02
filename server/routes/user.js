const express = require('express');

const userControllers = require('../controllers/user')
const authMiddleware = require('../middleware/auth')

// const userOperationsRoutes = require('./userOperations')


const router = express.Router();

router.use(express.static('public'));



// updated the edited profule information in db
router.post('/edit-profile', authMiddleware, userControllers.updateProfile);

// get profile data form db
router.get('/edit-profile', authMiddleware, userControllers.getProfile);

// display user dashboard
router.get('/dashboard', authMiddleware , userControllers.dashboard)

// display delete-account page 
router.get('/delete-account', authMiddleware , userControllers.deleteAccount)

// implementing delete-account page 
router.get('/delete', authMiddleware , userControllers.accountDelete )

// chats
router.get('/chats', authMiddleware , userControllers.chats )

// sessions management
// ///////////////////////////////////////////////////////////////////////////
// add sesions 
router.get('/session_management', authMiddleware , userControllers.addSessions )
router.post('/session_management', authMiddleware , userControllers.createSession )

//delete Sessions
router.post('/delete-session', authMiddleware , userControllers.deleteSession )

//edit Sessions
router.get('/edit-session', authMiddleware , userControllers.editSession )
router.post('/edit-session', authMiddleware , userControllers.updateSession )

// book session
router.get('/book-this-session', authMiddleware , userControllers.bookSession )
router.post('/process-payment', authMiddleware , userControllers.processPayment )

// all students
router.get('/students', authMiddleware, userControllers.allStudents)

// show sessions
router.get('/active-sessions', authMiddleware, userControllers.activeSessions)


// ////////////reviews
// get all reviews
router.get('/instructor-reviews', authMiddleware, userControllers.insReviews)
// add review get/post
router.get('/tutor-review', authMiddleware, userControllers.add_review)
router.get('/tutor-review', authMiddleware, userControllers.post_review)

//see user profile page (search etc)
router.get('/:username', userControllers.renderUserProfilePage);















module.exports = router;