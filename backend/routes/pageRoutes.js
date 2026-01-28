import express from 'express';
import { protect, admin } from '../middleware/checkAuth.js';

const router = express.Router();

// Admin: List all
router.get('/', protect, admin, (req, res) => {
    res.json([
        { _id: '1', title: 'About Us', slug: 'about', status: 'published', template: 'about' },
        { _id: '2', title: 'Terms', slug: 'terms', status: 'published', template: 'default' }
    ]);
});

// Admin: Save
router.post('/', protect, admin, (req, res) => {
    res.json({ message: 'Page saved' });
});

// Admin: Delete
router.delete('/:id', protect, admin, (req, res) => {
    res.json({ message: 'Page deleted' });
});

// Public: View
router.get('/store/:slug', (req, res) => {
    res.json({
        title: 'Sample Page',
        content: '<p>This is a sample page content.</p>',
        template: 'default'
    });
});

export default router;