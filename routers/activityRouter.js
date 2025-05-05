const express = require('express');
const router = express.Router();
const planController = require('../controllers/activityController');
const { authenticateUser } = require('../middlewares/auth');

// Activity routes
router.post('/addActivity/:userId/:planId', authenticateUser, planController.addActivity);
router.put('/updateActivity/:userId/:planId/:habitId/:dateIndex', authenticateUser, planController.updateActivity);
router.delete('/deleteActivity/:userId/:planId/:habitId/:dateIndex', authenticateUser, planController.deleteActivity);
router.put('/toggleActivityStatus/:userId/:planId/:habitId/:dateIndex', authenticateUser, planController.toggleActivityStatus);

module.exports = router;