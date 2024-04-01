const express = require('express');

const userControllers = require('../controllers/user')
const authMiddleware = require('../middleware/auth')

const userOperationsRoutes = require('./userOperations')


const router = express.Router();

router.use(express.static('public'));


// get profile data form db
router.get('/profile', authMiddleware, userControllers.getProfile);

// updated the edited profule information in db
router.put('/profile', authMiddleware, userControllers.updateProfile);

// instructor Routes
router.use('/', userOperationsRoutes)


// updated the edited profule information in db
router.get('/:username', userControllers.renderUserProfilePage);












module.exports = router;