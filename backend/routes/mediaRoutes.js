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

// Protected Routes (Admin Only)
router.post('/', protect, admin, upload.array('files'), uploadMedia);
router.get('/', protect, admin, getMedia);

export default router;