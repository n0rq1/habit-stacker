// middleware/authenticateUser.js
const jwt = require('jsonwebtoken');
const User = require('../models/usersModel'); 

exports.user = (req, res) => {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    console.log(req.user._id);
    res.json({
      _id: req.user._id,
      username: req.user.username,
    });
};