import express from 'express';
import asyncHandler from 'express-async-handler';
import Contact from '../models/contactModel.js';
import { protect, admin } from '../middleware/checkAuth.js';

const router = express.Router();

router.post('/', asyncHandler(async (req, res) => {
    await Contact.create(req.body);
    res.status(201).json({ message: 'Message sent successfully' });
}));

router.get('/', protect, admin, asyncHandler(async (req, res) => {
    const submissions = await Contact.find({}).sort({ createdAt: -1 });
    res.json(submissions);
}));

router.put('/:id', protect, admin, asyncHandler(async (req, res) => {
    const contact = await Contact.findById(req.params.id);
    if (contact) {
        contact.status = req.body.status || contact.status;
        await contact.save();
        res.json(contact);
    } else {
        res.status(404); throw new Error('Not Found');
    }
}));

export default router;