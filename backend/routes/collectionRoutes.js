import express from 'express';
import { protect, admin } from '../middleware/checkAuth.js';

const router = express.Router();

router.get('/', (req, res) => {
    res.json([]);
});

router.get('/:id', (req, res) => {
    res.json({});
});

router.post('/', protect, admin, (req, res) => {
    res.json({ message: 'Collection saved' });
});

router.delete('/:id', protect, admin, (req, res) => {
    res.json({ message: 'Collection deleted' });
});

export default router;