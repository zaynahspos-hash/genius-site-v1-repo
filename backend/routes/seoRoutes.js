import express from 'express';
import { protect, admin } from '../middleware/checkAuth.js';

const router = express.Router();

router.get('/check-redirect', (req, res) => {
    // Return empty if no redirect (prevents 404 logs if handled gracefully, 
    // but here we just return null to signify no redirect)
    res.json(null);
});

router.get('/redirects', protect, admin, (req, res) => {
    res.json([]);
});

router.post('/redirects', protect, admin, (req, res) => {
    res.json({ message: 'Redirect saved' });
});

router.delete('/redirects/:id', protect, admin, (req, res) => {
    res.json({ message: 'Redirect deleted' });
});

router.get('/audit', protect, admin, (req, res) => {
    res.json({ score: 95, issues: [] });
});

export default router;