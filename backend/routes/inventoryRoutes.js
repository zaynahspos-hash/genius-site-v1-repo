import express from 'express';
import { protect, admin } from '../middleware/checkAuth.js';

const router = express.Router();

router.get('/', protect, admin, (req, res) => {
    res.json([]);
});

router.put('/update', protect, admin, (req, res) => {
    res.json({ message: 'Stock updated' });
});

export default router;