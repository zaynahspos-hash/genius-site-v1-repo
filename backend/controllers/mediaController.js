import cloudinary from '../config/cloudinary.js';
import streamifier from 'streamifier';
import { Media } from '../models/mediaModel.js';

// @desc    Upload media files
// @route   POST /api/admin/media
// @access  Private/Admin
export const uploadMedia = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    const uploadPromises = req.files.map((file) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'shopgenius', resource_type: 'auto' },
          async (error, result) => {
            if (error) reject(error);
            else {
                // Save to DB
                const media = await Media.create({
                    url: result.secure_url,
                    public_id: result.public_id,
                    filename: file.originalname,
                    size: result.bytes,
                    type: result.resource_type,
                    width: result.width,
                    height: result.height
                });
                resolve(media);
            }
          }
        );
        streamifier.createReadStream(file.buffer).pipe(stream);
      });
    });

    const uploadedFiles = await Promise.all(uploadPromises);
    res.status(201).json({ message: 'Uploaded', media: uploadedFiles });
  } catch (error) {
    console.error('Upload Error:', error);
    res.status(500).json({ message: 'Upload failed', error: error.message });
  }
};

export const getMedia = async (req, res) => {
    const media = await Media.find({}).sort({ createdAt: -1 });
    res.json({ media });
};