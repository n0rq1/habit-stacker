const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const habitController = require('../controllers/habitController');
const { authenticateUser } = require('../middlewares/auth');

router.post('/createHabit/:userId', authenticateUser, upload.single('habitImage'), habitController.createHabit);
router.get('/getHabits/:userId', authenticateUser, habitController.getHabits);
router.put('/updateHabit/:userId/:habitId', authenticateUser, habitController.updateHabit);
router.delete('/removeHabit/:userId/:habitId', habitController.removeHabit);

module.exports = router;