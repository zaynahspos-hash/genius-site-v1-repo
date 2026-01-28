import express from 'express';
import multer from 'multer';
import { uploadMedia, getMedia } from '../controllers/mediaController.js';
import { protect, admin } from '../middleware/checkAuth.js';

const router = express.Router();

// Configure Multer to store files in memory
const storage = multer.memoryStorage();
const upload = multer({ 
    storage,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// IMPORTANT: Specific routes must come before generic ones

// Stats Endpoint
router.get('/stats', protect, admin, (req, res) => {
    res.json({
        count: 24,
        totalSize: 8500000, // bytes
        typeBreakdown: { image: 20, video: 4 }
    });
});

// Folders Endpoints
router.get('/folders', protect, admin, (req, res) => {
    // Mock Folders
    res.json([
        { _id: '1', name: 'Products', parent: null },
        { _id: '2', name: 'Banners', parent: null },
        { _id: '3', name: 'Blog', parent: null }
    ]);
});

router.post('/folders', protect, admin, (req, res) => {
    const { name } = req.body;
    res.status(201).json({ _id: Date.now().toString(), name, parent: null });
});

router.delete('/folders/:id', protect, admin, (req, res) => {
    res.json({ message: 'Folder deleted' });
});

// Bulk Operations
router.post('/bulk-delete', protect, admin, (req, res) => {
    res.json({ message: 'Items deleted' });
});

router.post('/bulk-move', protect, admin, (req, res) => {
    res.json({ message: 'Items moved' });
});

// Item Operations (Specific Item ID)
router.put('/:id', protect, admin, (req, res) => {
    res.json({ message: 'Item updated', ...req.body });
});

router.delete('/:id', protect, admin, (req, res) => {
    res.json({ message: 'Item deleted' });
});

// Core Media Routes (Root)
router.post('/', protect, admin, upload.array('files'), uploadMedia);
router.get('/', protect, admin, getMedia);

export default router;