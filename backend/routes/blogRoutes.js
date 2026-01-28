import express from 'express';
import asyncHandler from 'express-async-handler';
import BlogPost from '../models/blogModel.js';
import Category from '../models/categoryModel.js';
import { protect, admin } from '../middleware/checkAuth.js';

const router = express.Router();

router.get('/posts', asyncHandler(async (req, res) => {
    const query = req.query.admin ? {} : { status: 'published' };
    const posts = await BlogPost.find(query).populate('category', 'name').sort({ publishDate: -1 });
    res.json(posts);
}));

router.get('/posts/:slug', asyncHandler(async (req, res) => {
    const post = await BlogPost.findOne({ slug: req.params.slug }).populate('author', 'name').populate('category');
    if (post) {
        // Find related
        const related = await BlogPost.find({ _id: { $ne: post._id }, status: 'published' }).limit(3);
        res.json({ post, related });
    } else {
        res.status(404); throw new Error('Post not found');
    }
}));

router.post('/posts', protect, admin, asyncHandler(async (req, res) => {
    const { title, content, excerpt, image, category, status, tags } = req.body;
    let slug = req.body.slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    
    // Check slug uniqueness
    const exists = await BlogPost.findOne({ slug });
    if (exists && !req.body._id) slug = `${slug}-${Date.now()}`;

    if (req.body._id) {
        const post = await BlogPost.findById(req.body._id);
        if(post) {
            Object.assign(post, { title, content, excerpt, image, category, status, tags });
            await post.save();
            res.json(post);
        } else {
            res.status(404); throw new Error('Post not found');
        }
    } else {
        const post = await BlogPost.create({
            title, slug, content, excerpt, image, category, status, tags, author: req.user._id
        });
        res.status(201).json(post);
    }
}));

router.delete('/posts/:id', protect, admin, asyncHandler(async (req, res) => {
    await BlogPost.deleteOne({ _id: req.params.id });
    res.json({ message: 'Deleted' });
}));

// Categories (Re-use existing category model or separate? Let's use Category model but filter by type if needed, or simple implementation here)
router.get('/categories', asyncHandler(async (req, res) => {
    const cats = await Category.find({});
    // Map to format expected by blog frontend (adding mock counts for now)
    const result = cats.map(c => ({ ...c.toObject(), count: 0 })); 
    res.json(result);
}));

export default router;