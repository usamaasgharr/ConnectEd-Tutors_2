const express = require('express');
const searchControllers = require('../controllers/searcontroller')


const router = express.Router();

//  user profile data showon on clicking user profile
// router.get('/search/user', searchControllers.getUserProfile);


// get the search result from the database
router.get('/search', searchControllers.getSearchResult);


module.exports = router;