const express = require('express');

const userControllers = require('../controllers/user')
const authMiddleware = require('../middleware/auth')


const router = express.Router();


// get profile data form db
router.get('/profile', authMiddleware, userControllers.getProfile);

// updated the edited profule information in db
router.put('/profile', authMiddleware, userControllers.updateProfile);



// router.get('/chats', authMiddleware, userControllers.getProfile);







module.exports = router;