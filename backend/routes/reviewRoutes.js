import express from 'express';
import asyncHandler from 'express-async-handler';
import Review from '../models/reviewModel.js';
import Product from '../models/productModel.js';
import Order from '../models/orderModel.js';
import { protect, admin } from '../middleware/checkAuth.js';

const router = express.Router({ mergeParams: true });

// Helper to update product rating stats
const updateProductStats = async (productId) => {
    const stats = await Review.aggregate([
        { $match: { product: productId, status: 'approved' } },
        { $group: { _id: '$product', avgRating: { $avg: '$rating' }, numReviews: { $sum: 1 } } }
    ]);

    const product = await Product.findById(productId);
    if (product) {
        product.rating = stats[0]?.avgRating || 0;
        product.numReviews = stats[0]?.numReviews || 0;
        await product.save();
    }
};

// @desc    Get Reviews
// @route   GET /api/reviews or /api/products/:productId/reviews
router.get('/', asyncHandler(async (req, res) => {
    const { productId } = req.params;
    const { status, sort } = req.query;

    let query = {};
    if (productId) query.product = productId;
    
    // If public (with productId), only show approved. If admin (no productId usually), show filtered or all.
    // However, looking at app structure, admin uses /api/admin/reviews which maps here too if not careful, 
    // but app.js mounts generic route. Let's rely on query params.
    if (!req.user || req.user.role !== 'admin') {
        query.status = 'approved';
    } else if (status && status !== 'all') {
        query.status = status;
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'highest') sortOption = { rating: -1 };
    if (sort === 'lowest') sortOption = { rating: 1 };
    if (sort === 'helpful') sortOption = { helpfulCount: -1 };

    const reviews = await Review.find(query)
        .populate('user', 'name')
        .populate('product', 'title') // For admin view
        .sort(sortOption);

    // Calc breakdown for product view
    let breakdown = {};
    if (productId) {
        const allReviews = await Review.find({ product: productId, status: 'approved' });
        const total = allReviews.length;
        const sum = allReviews.reduce((acc, r) => acc + r.rating, 0);
        
        breakdown = {
            avg: total ? sum / total : 0,
            five: allReviews.filter(r => r.rating === 5).length,
            four: allReviews.filter(r => r.rating === 4).length,
            three: allReviews.filter(r => r.rating === 3).length,
            two: allReviews.filter(r => r.rating === 2).length,
            one: allReviews.filter(r => r.rating === 1).length,
        };
    }

    res.json({
        reviews,
        total: reviews.length,
        breakdown
    });
}));

// @desc    Create Review
// @route   POST /api/reviews
router.post('/', protect, asyncHandler(async (req, res) => {
    const { rating, title, comment, images, productId } = req.body;
    // Handle both body productId or param if mounted
    const targetProductId = productId || req.params.productId;

    const product = await Product.findById(targetProductId);
    if (!product) {
        res.status(404);
        throw new Error('Product not found');
    }

    const alreadyReviewed = await Review.findOne({
        product: targetProductId,
        user: req.user._id
    });

    if (alreadyReviewed) {
        res.status(400);
        throw new Error('Product already reviewed');
    }

    // Check for verified purchase
    const orders = await Order.find({ user: req.user._id, 'items.product': targetProductId });
    const isVerified = orders.length > 0;

    const review = await Review.create({
        product: targetProductId,
        user: req.user._id,
        rating: Number(rating),
        title,
        comment,
        images,
        isVerifiedPurchase: isVerified,
        status: 'pending' // Default to pending approval
    });

    res.status(201).json(review);
}));

// @desc    Mark Helpful
// @route   POST /api/reviews/:id/helpful
router.post('/:id/helpful', asyncHandler(async (req, res) => {
    const review = await Review.findById(req.params.id);
    if (review) {
        review.helpfulCount = (review.helpfulCount || 0) + 1;
        await review.save();
        res.json(review);
    } else {
        res.status(404); throw new Error('Review not found');
    }
}));

// @desc    Update Status (Admin)
// @route   PUT /api/reviews/:id/status
router.put('/:id/status', protect, admin, asyncHandler(async (req, res) => {
    const { status } = req.body;
    const review = await Review.findById(req.params.id);

    if (review) {
        review.status = status;
        await review.save();
        
        // Update product aggregate stats
        await updateProductStats(review.product);

        res.json(review);
    } else {
        res.status(404); throw new Error('Review not found');
    }
}));

export default router;