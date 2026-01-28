import express from 'express';
import { protect, admin } from '../middleware/checkAuth.js';

const router = express.Router();

// Admin: List all customers
router.get('/', protect, admin, (req, res) => {
    res.json([]);
});

// Admin: Get specific customer
router.get('/:id', protect, admin, (req, res) => {
    res.status(404).json({ message: 'Customer not found' });
});

export default router;