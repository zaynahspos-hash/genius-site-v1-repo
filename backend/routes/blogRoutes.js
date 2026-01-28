import express from 'express';
import { protect, admin } from '../middleware/checkAuth.js';

const router = express.Router();

// -- Posts --
router.get('/posts', (req, res) => {
    res.json([
        { _id: '1', title: 'Welcome to our Store', slug: 'welcome', excerpt: 'We are live!', publishDate: new Date(), status: 'published' },
        { _id: '2', title: 'Top 10 Trends', slug: 'trends', excerpt: 'Check this out', publishDate: new Date(), status: 'published' }
    ]);
});

router.get('/posts/:slug', (req, res) => {
    res.json({
        post: { _id: '1', title: 'Welcome to our Store', content: '<p>Content goes here</p>', publishDate: new Date(), author: { name: 'Admin' } },
        related: []
    });
});

router.post('/posts', protect, admin, (req, res) => {
    res.status(201).json({ message: 'Post saved' });
});

router.delete('/posts/:id', protect, admin, (req, res) => {
    res.json({ message: 'Post deleted' });
});

// -- Categories --
router.get('/categories', (req, res) => {
    res.json([
        { _id: '1', name: 'News', count: 5 },
        { _id: '2', name: 'Tips', count: 3 }
    ]);
});

router.post('/categories', protect, admin, (req, res) => {
    res.json({ message: 'Category saved' });
});

router.delete('/categories/:id', protect, admin, (req, res) => {
    res.json({ message: 'Category deleted' });
});

export default router;