import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

// The Bouncer: Only allows the specific email defined in environment variables
const admin = (req, res, next) => {
  const allowedEmail = process.env.ADMIN_EMAIL || process.env.ALLOWED_EMAIL;
  
  if (req.user && req.user.role === 'admin') {
    // Strict Environment Check
    if (allowedEmail && req.user.email !== allowedEmail) {
      res.status(403);
      throw new Error('Access Denied: This email is not authorized for the Admin Panel.');
    }
    next();
  } else {
    res.status(401);
    throw new Error('Not authorized as an admin');
  }
};

export { protect, admin };