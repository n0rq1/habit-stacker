const express = require('express');
const router = express.Router();
const planController = require('../controllers/planController');
const { authenticateUser } = require('../middlewares/auth');

router.post('/create', authenticateUser, planController.createPlan);

module.exports = router;