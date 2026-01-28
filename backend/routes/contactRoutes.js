import express from 'express';
import { protect, admin } from '../middleware/checkAuth.js';

const router = express.Router();

// Public: Submit contact form
router.post('/', (req, res) => {
    // In a real app, save to DB or send email
    res.status(201).json({ message: 'Message sent successfully' });
});

// Admin: Get all submissions
router.get('/', protect, admin, (req, res) => {
    res.json([
        { _id: '1', name: 'Alice', email: 'alice@example.com', subject: 'Inquiry', message: 'Hello', status: 'new', createdAt: new Date() },
        { _id: '2', name: 'Bob', email: 'bob@example.com', subject: 'Support', message: 'Help needed', status: 'read', createdAt: new Date() }
    ]);
});

// Admin: Update submission status
router.put('/:id', protect, admin, (req, res) => {
    res.json({ message: 'Updated successfully' });
});

export default router;