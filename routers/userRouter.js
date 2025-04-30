const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateUser } = require('../middlewares/auth');

// GET request
router.get('/', authenticateUser, userController.user);

module.exports = router;