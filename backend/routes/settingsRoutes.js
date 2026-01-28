import express from 'express';
import { protect, admin } from '../middleware/checkAuth.js';

const router = express.Router();

const defaultSettings = {
    general: { storeName: 'ShopGenius', storeEmail: 'admin@example.com', currency: 'USD' },
    theme: { colors: { primary: '#4f46e5' } },
    payment: { stripe: { enabled: false }, cod: { enabled: true } },
    // ... other defaults
};

let memorySettings = { ...defaultSettings };

// Public Settings (Read Only)
router.get('/', (req, res) => {
    res.json(memorySettings);
});

// Admin Updates
router.put('/:section', protect, admin, (req, res) => {
    const { section } = req.params;
    if (section === 'all') {
        memorySettings = { ...memorySettings, ...req.body };
    } else {
        memorySettings[section] = { ...memorySettings[section], ...req.body };
    }
    res.json(memorySettings);
});

router.post('/test-email', protect, admin, (req, res) => {
    // Simulate email sending
    res.json({ message: 'Test email sent' });
});

router.get('/menus', (req, res) => {
    res.json([]);
});

router.post('/menus', protect, admin, (req, res) => {
    res.json({ message: 'Menu saved' });
});

export default router;