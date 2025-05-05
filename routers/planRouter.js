const express = require('express');
const router = express.Router();
const planController = require('../controllers/planController');
const { authenticateUser } = require('../middlewares/auth');

router.post('/createPlan/:userId', authenticateUser, planController.createPlan);
router.get('/getPlans/:userId', authenticateUser, planController.getPlans);
router.put('/updatePlan/:userId/:planId', authenticateUser, planController.updatePlan);
router.delete('/removePlan/:userId/:planId', authenticateUser, planController.removePlan);
router.get('/getPlan/:userId/:planId', authenticateUser, planController.getPlan);
router.put('/updateActivityStatus/:userId/:planId', authenticateUser, planController.updateActivityStatus);

module.exports = router;