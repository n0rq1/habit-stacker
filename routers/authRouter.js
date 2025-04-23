const express = require('express');
const router = express.Router();

const habitController = require('../controllers/habitController');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

const { authenticateUser } = require('../middlewares/auth');
const { habitSchema } = require('../middlewares/validator');

router.post('/signup', authController.signup);
router.post('/signin', authController.signin);
router.post('/signout', authController.signout);

router.post('/habit', authenticateUser, habitController.createHabit);
router.get('/habit', authenticateUser, habitController.getHabits);
router.put('/habit/:habitId', authenticateUser, habitController.updateHabit);

router.get('/test', (req, res) => {
    console.log('/api/auth/test hit!');
    res.json({ message: 'Test success!' });
});

module.exports = router;