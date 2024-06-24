const express = require('express');
const { signupValidation, loginValidation } = require('../middleware/validation');
const authController = require('../controllers/auth');

const router = express.Router();


/////////////////////////////////
router.get('/login', (req, res) =>{
    res.render('sign-in', {errorMessage: null});
})

router.get('/signup', (req, res) =>{
    res.render('sign-up', {error: null});
})

/////////////////////////////////////


router.post('/signup', signupValidation,  authController.signup);


// login route
router.post('/login', loginValidation, authController.login)

// signout
router.get('/signout', authController.signout)



module.exports = router;
