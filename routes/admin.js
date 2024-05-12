const express = require('express');
const adminController = require('../controllers/admin')
const authControllers = require('../controllers/auth')
const adminMiddleware = require('../middleware/adminMiddleware')

const router = express.Router();
// need to add admin auth middleware




// login admin Routes
router.get('/add-new',adminMiddleware ,adminController.addNewAdmin_View)
router.post('/add-new',adminMiddleware ,adminController.addNewAdmin)


// Route for deleting a user account by admin
router.get('/delete-user', adminMiddleware ,adminController.deleteUserAccount_View);
router.post('/delete-user', adminMiddleware ,adminController.deleteUserAccount);


// search from users
router.get('/search-user', adminMiddleware ,adminController.searchUser);

// activate or deactivate user Account
router.get('/toggle-user-status', adminMiddleware ,adminController.toggleUserStatus_View);
router.post('/toggle-user-status', adminMiddleware ,adminController.toggleUserStatus);

router.get('/dashboard', adminMiddleware , adminController.dashboard)

router.get('/signout', authControllers.adminSignout)

// requests
router.get('/all-requests',adminMiddleware ,adminController.allRequests)
router.get('/request/:username',adminMiddleware ,adminController.request_View)
router.post('/request/:username',adminMiddleware ,adminController.req_status)

router.get('/', adminController.AdminloginPage);
// Login for admin
router.post('/', authControllers.Adminlogin);




module.exports = router;