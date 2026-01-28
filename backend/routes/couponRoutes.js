import express from 'express';
import { protect, admin } from '../middleware/checkAuth.js';

const router = express.Router();

router.get('/', protect, admin, (req, res) => {
    res.json([
        { _id: '1', code: 'WELCOME10', discountType: 'percentage', value: 10, minPurchase: 50, isActive: true, usedCount: 15 },
        { _id: '2', code: 'SUMMER50', discountType: 'fixed', value: 50, minPurchase: 200, isActive: false, usedCount: 50 }
    ]);
});

router.post('/', protect, admin, (req, res) => {
    res.status(201).json({ message: 'Coupon created', ...req.body });
});

router.put('/:id', protect, admin, (req, res) => {
    res.json({ message: 'Coupon updated' });
});

router.delete('/:id', protect, admin, (req, res) => {
    res.json({ message: 'Coupon deleted' });
});

export default router;