const express = require('express');
const router = express.Router();

const habitController = require('../controllers/habitController');
const { authenticateUser } = require('../middlewares/auth');

router.post('/create', authenticateUser, habitController.createHabit);
router.get('/getHabit', authenticateUser, habitController.getHabits);
router.put('/update/:habitId', authenticateUser, habitController.updateHabit);

module.exports = router;