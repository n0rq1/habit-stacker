const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const authController = require('../controllers/authController');
const { authenticateUser } = require('../middlewares/auth');
const { habitSchema } = require('../middlewares/validator');

router.post('/signup', authController.signup);
router.post('/signin', authController.signin);
router.post('/signout', authController.signout);
router.put('/updateProfile', upload.single('profileImage'), authController.updateProfile);
router.post('/habit', authenticateUser, authController.createHabit);

module.exports = router;