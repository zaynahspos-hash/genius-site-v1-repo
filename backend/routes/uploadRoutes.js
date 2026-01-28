import express from 'express';
import multer from 'multer';
import cloudinary from '../config/cloudinary.js';
import streamifier from 'streamifier';
import { protect } from '../middleware/checkAuth.js';

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/', protect, upload.single('image'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    try {
        const stream = cloudinary.uploader.upload_stream(
            { folder: 'shopgenius/products' },
            (error, result) => {
                if (error) {
                    console.error('Cloudinary Error:', error);
                    return res.status(500).json({ message: 'Upload failed' });
                }
                res.json({ 
                    url: result.secure_url,
                    imageUrl: result.secure_url // Support legacy frontend expectations
                });
            }
        );
        streamifier.createReadStream(req.file.buffer).pipe(stream);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during upload' });
    }
});

export default router;