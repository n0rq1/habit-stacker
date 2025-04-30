const jwt = require('jsonwebtoken');
const { authenticateUser } = require('../middlewares/auth');
const User = require('../models/usersModel'); 

exports.user = async (req, res) => {
  try {
      const userId = req.user._id;

      const user = await User.findById(userId).select('-password'); // exclude password
      if (!user) {
          return res.status(404).json({ success: false, message: 'User not found' });
      }

      res.status(200).json({
          success: true,
          user
      });

  } catch (err) {
      console.error("Get User error:", err);
      res.status(500).json({ success: false, message: "Internal server error" });
  }
};