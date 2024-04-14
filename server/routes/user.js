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

// implementing delete-account page 
router.get('/chats', authMiddleware , userControllers.chats )

// sessions management
router.get('/session_management', authMiddleware , userControllers.addSessions )
router.post('/session_management', authMiddleware , userControllers.createSession )

// router.post('/session_management', authMiddleware , userControllers.edit_sessions )

//see user profile page (search etc)
router.get('/:username', userControllers.renderUserProfilePage);















module.exports = router;