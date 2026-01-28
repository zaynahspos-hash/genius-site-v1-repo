import express from 'express';
import asyncHandler from 'express-async-handler';
import Coupon from '../models/couponModel.js';
import { protect, admin } from '../middleware/checkAuth.js';

const router = express.Router();

router.get('/', protect, admin, asyncHandler(async (req, res) => {
    const coupons = await Coupon.find({});
    res.json(coupons);
}));

router.post('/', protect, admin, asyncHandler(async (req, res) => {
    const { code, discountType, value, minPurchase, usageLimit, isActive } = req.body;
    const coupon = await Coupon.create({ code, discountType, value, minPurchase, usageLimit, isActive });
    res.status(201).json(coupon);
}));

router.put('/:id', protect, admin, asyncHandler(async (req, res) => {
    const coupon = await Coupon.findById(req.params.id);
    if (coupon) {
        Object.assign(coupon, req.body);
        await coupon.save();
        res.json(coupon);
    } else {
        res.status(404); throw new Error('Coupon not found');
    }
}));

router.delete('/:id', protect, admin, asyncHandler(async (req, res) => {
    await Coupon.deleteOne({ _id: req.params.id });
    res.json({ message: 'Deleted' });
}));

export default router;