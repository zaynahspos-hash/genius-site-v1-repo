import express from 'express';
import asyncHandler from 'express-async-handler';
import Product from '../models/productModel.js';

const router = express.Router();

// @desc    Get store config
// @route   GET /api/store/init
router.get('/init', (req, res) => {
    res.json({
        storeName: 'ShopGenius',
        currency: 'USD',
        maintenance: false
    });
});

// @desc    Public get products wrapper
// @route   GET /api/store/products
router.get('/products', asyncHandler(async (req, res) => {
    // Re-use core product logic or simplified
    const pageSize = Number(req.query.limit) || 12;
    const query = {};
    
    if (req.query.search) {
        query.title = { $regex: req.query.search, $options: 'i' };
    }
    if (req.query.category) {
        query.category = req.query.category; // Simple match
    }
    
    const products = await Product.find(query).limit(pageSize);
    const count = await Product.countDocuments(query);
    
    res.json({ products, count, page: 1, pages: 1 });
}));

// @desc    Get single product by slug
// @route   GET /api/store/products/:slug
router.get('/products/:slug', asyncHandler(async (req, res) => {
    const product = await Product.findOne({ slug: req.params.slug });
    if (product) {
        res.json(product);
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
}));

// @desc    Newsletter signup
// @route   POST /api/store/newsletter
router.post('/newsletter', (req, res) => {
    res.json({ message: 'Subscribed successfully' });
});

// @desc    Check Coupon
// @route   POST /api/store/cart/coupon
router.post('/cart/coupon', (req, res) => {
    const { code, cartTotal } = req.body;
    
    // Mock Logic
    if (code === 'WELCOME10') {
        res.json({
            code: 'WELCOME10',
            coupon: 'Welcome Discount',
            discount: cartTotal * 0.10, // 10%
            type: 'percentage'
        });
    } else if (code === 'SAVE20') {
        res.json({
            code: 'SAVE20',
            coupon: 'Save 20',
            discount: 20,
            type: 'fixed'
        });
    } else {
        res.status(400);
        throw new Error('Invalid coupon code');
    }
});

// @desc    Checkout Process
// @route   POST /api/store/checkout
router.post('/checkout', (req, res) => {
    // In real app, call Order.create here
    res.status(201).json({
        id: 'ORDER-' + Date.now(),
        message: 'Order placed successfully'
    });
});

export default router;