import asyncHandler from 'express-async-handler';
import generateToken from '../utils/generateToken.js';
import User from '../models/userModel.js';

// @desc    Auth user & get token (DEV MODE: PASSWORD BYPASS)
// @route   POST /api/auth/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  console.log(`🔓 Dev Mode Login Access Requested`);

  // Try to find the real admin user first to get a real ID
  const adminEmail = process.env.ADMIN_EMAIL || 'totvoguepk@gmail.com';
  let user = await User.findOne({ email: adminEmail });

  // If user doesn't exist in DB yet, create a temporary object for the token
  // The middleware has also been updated to handle this 'virtual' user
  if (!user) {
      console.log('⚠️ Admin user not found in DB, using virtual admin.');
      user = {
          _id: '000000000000000000000000', // Dummy Mongo ID
          name: 'Super Admin (Dev)',
          email: adminEmail,
          role: 'admin'
      };
  }

  // FORCE SUCCESS - NO PASSWORD CHECK
  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: 'admin', // Force role
    token: generateToken(user._id),
  });
});

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const adminEmail = process.env.ADMIN_EMAIL || 'totvoguepk@gmail.com';
  const role = (email === adminEmail) ? 'admin' : 'customer';

  const user = await User.create({
    name,
    email,
    password,
    role
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

export { authUser, registerUser };