import express from 'express';
import asyncHandler from 'express-async-handler';
import Page from '../models/pageModel.js';
import { protect, admin } from '../middleware/checkAuth.js';

const router = express.Router();

router.get('/', protect, admin, asyncHandler(async (req, res) => {
    const pages = await Page.find({});
    res.json(pages);
}));

router.post('/', protect, admin, asyncHandler(async (req, res) => {
    const { title, content, template, status, showInNav } = req.body;
    let slug = req.body.slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    if (req.body._id) {
        const page = await Page.findById(req.body._id);
        if(page) {
            Object.assign(page, { title, slug, content, template, status, showInNav });
            await page.save();
            res.json(page);
        } else {
            res.status(404); throw new Error('Page not found');
        }
    } else {
        const page = await Page.create({ title, slug, content, template, status, showInNav });
        res.status(201).json(page);
    }
}));

router.delete('/:id', protect, admin, asyncHandler(async (req, res) => {
    await Page.deleteOne({ _id: req.params.id });
    res.json({ message: 'Page deleted' });
}));

router.get('/store/:slug', asyncHandler(async (req, res) => {
    const page = await Page.findOne({ slug: req.params.slug, status: 'published' });
    if (page) {
        res.json(page);
    } else {
        res.status(404); throw new Error('Page not found');
    }
}));

export default router;