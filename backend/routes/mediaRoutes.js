import express from 'express';
import multer from 'multer';
import streamifier from 'streamifier';
import cloudinary from '../config/cloudinary.js';
import { Media, Folder } from '../models/mediaModel.js';
import { protect, admin } from '../middleware/checkAuth.js';
import asyncHandler from 'express-async-handler';

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

// Get Stats
router.get('/stats', protect, admin, asyncHandler(async (req, res) => {
    const count = await Media.countDocuments();
    const result = await Media.aggregate([
        { $group: { _id: null, totalSize: { $sum: '$size' } } }
    ]);
    const totalSize = result[0]?.totalSize || 0;
    
    // Breakdown by type
    const breakdown = await Media.aggregate([
        { $group: { _id: '$type', count: { $sum: 1 } } }
    ]);
    const typeBreakdown = breakdown.reduce((acc, curr) => ({ ...acc, [curr._id]: curr.count }), {});

    res.json({ count, totalSize, typeBreakdown });
}));

// Folders
router.get('/folders', protect, admin, asyncHandler(async (req, res) => {
    const folders = await Folder.find({});
    res.json(folders);
}));

router.post('/folders', protect, admin, asyncHandler(async (req, res) => {
    const folder = await Folder.create(req.body);
    res.status(201).json(folder);
}));

router.delete('/folders/:id', protect, admin, asyncHandler(async (req, res) => {
    await Folder.deleteOne({ _id: req.params.id });
    // Move items to root
    await Media.updateMany({ folder: req.params.id }, { folder: null });
    res.json({ message: 'Folder deleted' });
}));

// Media Files
router.get('/', protect, admin, asyncHandler(async (req, res) => {
    const { folder, search } = req.query;
    let query = {};
    
    if (folder === 'uncategorized') query.folder = null;
    else if (folder && folder !== 'all') query.folder = folder;
    
    if (search) query.filename = { $regex: search, $options: 'i' };

    const media = await Media.find(query).populate('folder').sort({ createdAt: -1 });
    res.json({ media });
}));

router.post('/', protect, admin, upload.array('files'), asyncHandler(async (req, res) => {
    const folderId = req.body.folderId === 'uncategorized' ? null : req.body.folderId;

    const promises = (req.files || []).map(file => {
        return new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                { folder: 'shopgenius', resource_type: 'auto' },
                async (error, result) => {
                    if (error) reject(error);
                    else {
                        const newMedia = await Media.create({
                            url: result.secure_url,
                            public_id: result.public_id,
                            filename: file.originalname,
                            size: result.bytes,
                            type: result.resource_type,
                            folder: folderId || null
                        });
                        resolve(newMedia);
                    }
                }
            );
            streamifier.createReadStream(file.buffer).pipe(stream);
        });
    });

    const uploaded = await Promise.all(promises);
    res.status(201).json({ message: 'Uploaded', media: uploaded });
}));

router.delete('/:id', protect, admin, asyncHandler(async (req, res) => {
    const media = await Media.findById(req.params.id);
    if (media) {
        if (media.public_id) {
            await cloudinary.uploader.destroy(media.public_id);
        }
        await Media.deleteOne({ _id: media._id });
        res.json({ message: 'Deleted' });
    } else {
        res.status(404); throw new Error('Not found');
    }
}));

router.put('/:id', protect, admin, asyncHandler(async (req, res) => {
    const media = await Media.findById(req.params.id);
    if(media) {
        Object.assign(media, req.body);
        await media.save();
        res.json(media);
    } else {
        res.status(404); throw new Error('Not found');
    }
}));

// Bulk
router.post('/bulk-delete', protect, admin, asyncHandler(async (req, res) => {
    const { ids } = req.body;
    await Media.deleteMany({ _id: { $in: ids } });
    res.json({ message: 'Deleted' });
}));

router.post('/bulk-move', protect, admin, asyncHandler(async (req, res) => {
    const { ids, folderId } = req.body;
    await Media.updateMany({ _id: { $in: ids } }, { folder: folderId });
    res.json({ message: 'Moved' });
}));

export default router;