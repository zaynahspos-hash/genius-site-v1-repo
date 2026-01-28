import express from 'express';
import asyncHandler from 'express-async-handler';
import Product from '../models/productModel.js';

const router = express.Router();

// @desc    Get related products
// @route   GET /api/store/recommendations/products/:id/related
router.get('/products/:id/related', asyncHandler(async (req, res) => {
    // Simple logic: return other products
    const products = await Product.find({ _id: { $ne: req.params.id } }).limit(4);
    res.json(products);
}));

// @desc    Get frequently bought together
// @route   GET /api/store/recommendations/products/:id/frequently-bought
router.get('/products/:id/frequently-bought', asyncHandler(async (req, res) => {
    // Mock: random products
    const products = await Product.find({ _id: { $ne: req.params.id } }).limit(2);
    res.json(products);
}));

// @desc    Get recently viewed
// @route   GET /api/store/recommendations/recently-viewed
router.get('/recently-viewed', asyncHandler(async (req, res) => {
    const ids = req.query.ids ? req.query.ids.split(',') : [];
    if (ids.length === 0) return res.json([]);
    
    const products = await Product.find({ _id: { $in: ids } });
    res.json(products);
}));

// @desc    Track view
// @route   POST /api/store/recommendations/track-view/:id
router.post('/track-view/:id', (req, res) => {
    // Analytics logic would go here
    res.json({ message: 'View tracked' });
});

// @desc    Get trending products
// @route   GET /api/store/recommendations/trending
router.get('/trending', asyncHandler(async (req, res) => {
    // Return most recent or "featured"
    const products = await Product.find({}).sort({ createdAt: -1 }).limit(8);
    res.json(products);
}));

export default router;