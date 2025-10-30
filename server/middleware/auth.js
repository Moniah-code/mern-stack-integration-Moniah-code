const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    console.log('Token received:', token);
    console.log('JWT_SECRET:', process.env.JWT_SECRET || 'your_jwt_secret_here');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_here');
    console.log('Token decoded:', decoded);
    req.user = await User.findById(decoded.id).select('-password');
    next();
  } catch (err) {
    console.error('Token verification error:', err);
    res.status(401).json({ message: 'Token is not valid' });
  }
};
