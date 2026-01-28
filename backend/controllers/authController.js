import asyncHandler from 'express-async-handler';
import generateToken from '../utils/generateToken.js';
import User from '../models/userModel.js';

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  
  // Basic Validation
  if (!email || !password) {
    res.status(400);
    throw new Error('Please provide both email and password');
  }

  console.log(`🔐 Login attempt for: ${email}`);

  const user = await User.findOne({ email });

  if (!user) {
    console.log(`❌ User not found: ${email}`);
    // Security: Usually we return generic message, but for this admin setup debugging:
    res.status(401);
    throw new Error('User not found. Please Register or check Admin Email.');
  }

  if (await user.matchPassword(password)) {
    console.log(`✅ Login successful: ${email}`);
    
    // Optional: Pre-check for admin login attempts if needed
    // if (process.env.ADMIN_EMAIL && email !== process.env.ADMIN_EMAIL) { ... }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    console.log(`❌ Invalid password for: ${email}`);
    res.status(401);
    throw new Error('Invalid email or password');
  }
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

  // Auto-promote to admin ONLY if email matches the secret env variable OR the hardcoded fallback
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