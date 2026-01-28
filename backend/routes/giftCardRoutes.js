import express from 'express';

const router = express.Router();

// @desc    Check gift card balance
// @route   POST /api/gift-cards/check
router.post('/check', (req, res) => {
    const { code } = req.body;
    
    // Mock Gift Cards
    if (code === 'GIFT100') {
        res.json({
            code: 'GIFT100',
            balance: 100.00,
            currency: 'USD'
        });
    } else if (code === 'GIFT50') {
        res.json({
            code: 'GIFT50',
            balance: 50.00,
            currency: 'USD'
        });
    } else {
        res.status(404).json({ message: 'Invalid gift card code' });
    }
});

export default router;