import express from 'express';
import asyncHandler from 'express-async-handler';
import Category from '../models/categoryModel.js';
import { protect, admin } from '../middleware/checkAuth.js';

const router = express.Router();

router.get('/', asyncHandler(async (req, res) => {
    const categories = await Category.find({}).sort({ order: 1, createdAt: -1 }).populate('parent', 'name');
    res.json(categories);
}));

router.post('/', protect, admin, asyncHandler(async (req, res) => {
    const { name, description, parent, image } = req.body;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    
    const category = await Category.create({ name, slug, description, parent: parent || null, image });
    res.status(201).json(category);
}));

router.put('/:id', protect, admin, asyncHandler(async (req, res) => {
    const category = await Category.findById(req.params.id);
    if (category) {
        category.name = req.body.name || category.name;
        category.description = req.body.description || category.description;
        category.parent = req.body.parent || category.parent;
        category.image = req.body.image || category.image;
        const updatedCategory = await category.save();
        res.json(updatedCategory);
    } else {
        res.status(404); throw new Error('Category not found');
    }
}));

router.delete('/:id', protect, admin, asyncHandler(async (req, res) => {
    const category = await Category.findById(req.params.id);
    if (category) {
        await Category.deleteOne({ _id: category._id });
        res.json({ message: 'Category removed' });
    } else {
        res.status(404); throw new Error('Category not found');
    }
}));

export default router;