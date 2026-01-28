import express from 'express';
import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import generateToken from '../utils/generateToken.js';
import { protect } from '../middleware/checkAuth.js';

const router = express.Router();

// @desc    Register new customer
// @route   POST /api/customer/register
router.post('/register', asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
    
    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    const user = await User.create({
        name,
        email,
        password,
        role: 'customer'
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
}));

// @desc    Auth customer & get token
// @route   POST /api/customer/login
router.post('/login', asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        });
    } else {
        res.status(401);
        throw new Error('Invalid email or password');
    }
}));

// @desc    Get customer profile
// @route   GET /api/customer/profile
router.get('/profile', protect, asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).select('-password');
    if (user) {
        res.json(user);
    } else {
        res.status(404);
        throw new Error('User not found');
    }
}));

// @desc    Update customer profile
// @route   PUT /api/customer/profile
router.put('/profile', protect, asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        if (req.body.password) {
            user.password = req.body.password;
        }
        const updatedUser = await user.save();
        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            token: generateToken(updatedUser._id),
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
}));

// @desc    Get customer orders
// @route   GET /api/customer/orders
router.get('/orders', protect, asyncHandler(async (req, res) => {
    // In a real app, you'd import the Order model. 
    // This is a placeholder to prevent crashes if Order model isn't imported
    // Assuming Order model exists, otherwise return empty
    try {
        // const orders = await Order.find({ user: req.user._id });
        res.json([]); 
    } catch (error) {
        res.json([]);
    }
}));

// @desc    Add address
// @route   POST /api/customer/addresses
router.post('/addresses', protect, asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
        user.addresses.push(req.body);
        await user.save();
        res.json(user.addresses);
    } else {
        res.status(404);
        throw new Error('User not found');
    }
}));

// @desc    Remove address
// @route   DELETE /api/customer/addresses/:id
router.delete('/addresses/:id', protect, asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
        user.addresses = user.addresses.filter(addr => addr._id.toString() !== req.params.id);
        await user.save();
        res.json(user.addresses);
    } else {
        res.status(404);
        throw new Error('User not found');
    }
}));

// @desc    Toggle wishlist
// @route   POST /api/customer/wishlist
router.post('/wishlist', protect, asyncHandler(async (req, res) => {
    const { productId } = req.body;
    const user = await User.findById(req.user._id);
    
    if (user) {
        // Check if product in wishlist
        const index = user.wishlist.indexOf(productId);
        if (index > -1) {
            user.wishlist.splice(index, 1); // Remove
        } else {
            user.wishlist.push(productId); // Add
        }
        await user.save();
        
        // Return full populated wishlist in real app, here just the IDs
        res.json(user.wishlist);
    } else {
        res.status(404);
        throw new Error('User not found');
    }
}));

export default router;