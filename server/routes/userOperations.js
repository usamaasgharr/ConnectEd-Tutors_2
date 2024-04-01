const express = require('express');
const authMiddleware = require('../middleware/auth')
const userOperationController = require('../controllers/userOperations')


const router = express.Router();

router.use(express.static('public'));

router.get('/dashboard', authMiddleware , userOperationController.dashboard)

module.exports  = router;