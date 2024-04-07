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

//see user profile page (search etc)
router.get('/:username', userControllers.renderUserProfilePage);















module.exports = router;