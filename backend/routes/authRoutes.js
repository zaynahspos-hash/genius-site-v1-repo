import express from 'express';
import { authUser, registerUser } from '../controllers/authController.js';
import { protect, admin } from '../middleware/checkAuth.js';

const router = express.Router();

// Public Routes
router.post('/login', authUser);
router.post('/register', registerUser);

// Protected Admin Verification Route
router.get('/verify-admin', protect, admin, (req, res) => {
    res.status(200).json({ 
        status: 'Authorized', 
        user: {
            id: req.user._id,
            name: req.user.name,
            email: req.user.email,
            role: req.user.role
        }
    });
});

export default router;