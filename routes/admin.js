const express = require('express');
const adminController = require('../controllers/admin')
const authControllers = require('../controllers/auth')
const adminMiddleware = require('../middleware/adminMiddleware')

const router = express.Router();
// need to add admin auth middleware

// login admin Routes
router.post('/add-new',adminMiddleware ,adminController.addNewAdmin)

// Route for deleting a user account by admin
router.delete('/delete-user/:username', adminMiddleware ,adminController.deleteUserAccount);

// search from users
router.get('/search-user', adminMiddleware ,adminController.searchUser);

// activate or deactivate user Account
router.put('/toggle-user-status/:username', adminMiddleware ,adminController.toggleUserStatus);


// Login for admin
router.post('/', authControllers.Adminlogin);



module.exports = router;