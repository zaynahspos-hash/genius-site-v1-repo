import express from 'express';
import { authUser, registerUser } from '../controllers/authController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/login', authUser);
router.post('/register', registerUser);

// Verification endpoint for frontend to check access
router.get('/verify-admin', protect, admin, (req, res) => {
    res.status(200).json({ status: 'Authorized', user: req.user });
});

export default router;