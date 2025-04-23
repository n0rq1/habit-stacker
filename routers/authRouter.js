const express = require('express');
const router = express.Router();

const habitController = require('../controllers/habitController');
const authController = require('../controllers/authController');
const { authenticateUser } = require('../middlewares/auth');
const { habitSchema } = require('../middlewares/validator');

/* POST requests */
//User handling
router.post('/signup', authController.signup);
router.post('/signin', authController.signin);
router.post('/signout', authController.signout);
//Habit handling
router.post('/habit', authenticateUser, habitController.createHabit);

/* GET requests */
//Habit handling
router.get('/habit', authenticateUser, habitController.getHabits);

/* PUT requests */
//Habit handling
router.put('/habit/:habitId', authenticateUser, habitController.updateHabit);

/* UPDATE requests */


/* DELETE requests */

module.exports = router;