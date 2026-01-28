import express from 'express';
import { protect, admin } from '../middleware/checkAuth.js';

const router = express.Router({ mergeParams: true });

// Public: Get reviews (optionally filtered by productId if mounted there)
router.get('/', (req, res) => {
    // Return mock data for product reviews
    res.json({
        reviews: [
            { _id: '1', user: { name: 'Customer A' }, rating: 5, comment: 'Great product!', title: 'Loved it', createdAt: new Date(), helpfulCount: 2 },
            { _id: '2', user: { name: 'Customer B' }, rating: 4, comment: 'Good value', title: 'Nice', createdAt: new Date(), helpfulCount: 0 }
        ],
        total: 2,
        breakdown: { avg: 4.5, five: 1, four: 1, three: 0, two: 0, one: 0 }
    });
});

// Public: Create review
router.post('/', protect, (req, res) => {
    res.status(201).json({ message: 'Review submitted' });
});

// Public: Mark helpful
router.post('/:id/helpful', (req, res) => {
    res.json({ message: 'Marked helpful' });
});

// Admin: Update review status
router.put('/:id/status', protect, admin, (req, res) => {
    res.json({ message: 'Status updated' });
});

export default router;