const jwt = require('jsonwebtoken');
const { authenticateUser } = require('../middlewares/auth');
const User = require('../models/usersModel'); 

exports.user = (req, res) => {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    res.json({
      _id: req.user._id,
      username: req.user.username,
      //add profile picture later
    });
};