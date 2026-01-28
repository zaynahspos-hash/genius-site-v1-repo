import express from 'express';
import { protect, admin } from '../middleware/checkAuth.js';

const router = express.Router();

const defaultSettings = {
    general: { storeName: 'ShopGenius', storeEmail: 'admin@example.com', currency: 'USD' },
    theme: { colors: { primary: '#4f46e5' }, layout: { productsPerRow: 4 } },
    payment: { stripe: { enabled: false }, cod: { enabled: true } },
    shipping: { standardRate: 10, freeShippingThreshold: 100 },
    email: { smtpHost: '', smtpPort: 587 },
    seo: { metaTitle: 'ShopGenius', metaDescription: '' }
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
    res.json({ message: 'Test email sent successfully' });
});

router.get('/menus', (req, res) => {
    res.json([
        { handle: 'main', title: 'Main Menu', items: [] },
        { handle: 'footer', title: 'Footer Menu', items: [] }
    ]);
});

router.post('/menus', protect, admin, (req, res) => {
    res.json({ message: 'Menu saved' });
});

export default router;