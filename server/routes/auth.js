const express = require('express');
const { signupValidation, loginValidation } = require('../middleware/validation');
const authController = require('../controllers/auth');

// const multer = require('multer')
// const upload = multer({ dest: 'uploads/' })


const router = express.Router();

// Signup route
// router.post('/signup', signupValidation, authController.signup);

router.post('/signup', signupValidation,  authController.signup);

// router.post('/signup', upload.single('profilePicture'), (req, res)=>{
//     console.log(req.body)
//     console.log(req.file)
//     res.send("reqreceived");
// });


// login route
router.post('/login', loginValidation, authController.login)

module.exports = router;
