const jwt = require('jsonwebtoken');
const User = require('../models/usersModel'); 

exports.authenticateUser = async (req, res, next) => {
    const token = req.cookies.Authorization?.split(' ')[1];
  
    if (!token) {
      return res.status(401).json({ success: false, message: 'Access Denied. No token provided.' });
    }
  
    try {
      console.log('Token received:', token);
  
      const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
      console.log('Decoded token:', decoded);
  
      const user = await User.findById(decoded.userId).select('_id username email verified');
  
      if (!user) {
        return res.status(401).json({ success: false, message: 'User not found' });
      }
  
      req.user = user;
      next();
    } catch (err) {
      console.error('Token verification error:', err); 
      return res.status(400).json({ success: false, message: 'Invalid token.' });
    }
};  