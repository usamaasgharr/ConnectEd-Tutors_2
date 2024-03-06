const express = require('express');
const authRoutes = require("./auth")
const userRoutes = require('./user');
const indexRoutes  = require('../controllers/index')
const adminRoutes = require("./admin");


const router = express.Router();



router.use('/admin', adminRoutes);

router.use('/api', authRoutes);         // login signup

router.use('/user', userRoutes);        // user route for updating and see information. // need ti add more like chats

router.get('/', indexRoutes);           // gets all user, review data form dataabse

module.exports = router;



