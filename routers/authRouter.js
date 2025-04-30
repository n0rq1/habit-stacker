const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

const { authenticateUser } = require('../middlewares/auth');
const { habitSchema } = require('../middlewares/validator');

router.post('/signup', upload.single('profileImage'), authController.signup);
router.post('/signin', authController.signin);
router.post('/signout', authController.signout);
router.put('/updateProfile', upload.single('profileImage'), authController.updateProfile);

module.exports = router;