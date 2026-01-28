import express from 'express';
import { protect, admin } from '../middleware/checkAuth.js';

const router = express.Router();

// Placeholder in-memory store for dev if DB logic isn't fully wired yet
// In real implementation, import Category model
router.get('/', (req, res) => {
    res.json([]);
});

router.post('/', protect, admin, (req, res) => {
    res.status(201).json({ message: 'Category created', ...req.body });
});

router.put('/:id', protect, admin, (req, res) => {
    res.json({ message: 'Category updated', ...req.body });
});

router.delete('/:id', protect, admin, (req, res) => {
    res.json({ message: 'Category deleted' });
});

router.put('/reorder', protect, admin, (req, res) => {
    res.json({ message: 'Reordered' });
});

export default router;