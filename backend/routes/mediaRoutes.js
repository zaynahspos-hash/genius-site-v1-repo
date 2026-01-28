import express from 'express';
import multer from 'multer';
import { uploadMedia, getMedia } from '../controllers/mediaController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Configure Multer to store files in memory
const storage = multer.memoryStorage();
const upload = multer({ 
    storage,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Apply auth middleware if you have it implemented, otherwise remove protect/admin
router.post('/', upload.array('files'), uploadMedia);
router.get('/', getMedia);

export default router;
