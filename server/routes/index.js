const express = require('express');
const authRoutes = require("./auth")
const userRoutes = require('./user');
const indexRoutes = require('../controllers/index')
const adminRoutes = require("./admin");
const searchRoutes = require('./search')



const router = express.Router();


router.use('/admin', adminRoutes);



router.get('/search', searchRoutes)

router.use('/user', userRoutes);        // user route for updating and see information. // need ti add more like chats

router.get('/about', indexRoutes.aboutRoute);

router.get('/contact', indexRoutes.contactRoute);


router.use('/', authRoutes);         // login signup

router.get('/', indexRoutes.getUserProfile);           // gets all user, review data form dataabse

router.use((req, res, next)=>{
    res.status(404).render('404');
})



module.exports = router;



