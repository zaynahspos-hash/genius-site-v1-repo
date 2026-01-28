import cloudinary from '../config/cloudinary.js';
import streamifier from 'streamifier';

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
          {
            folder: 'shopgenius', // Optional: organize in a folder
            resource_type: 'auto',
          },
          (error, result) => {
            if (error) reject(error);
            else resolve({
              url: result.secure_url,
              public_id: result.public_id,
              filename: file.originalname,
              size: result.bytes,
              type: result.resource_type,
              format: result.format,
              width: result.width,
              height: result.height,
              createdAt: new Date()
            });
          }
        );
        streamifier.createReadStream(file.buffer).pipe(stream);
      });
    });

    const uploadedFiles = await Promise.all(uploadPromises);
    
    // In a real app, you would save these file metadata to MongoDB here
    // const savedMedia = await Media.insertMany(uploadedFiles);

    res.status(201).json({ 
      message: 'Files uploaded successfully',
      media: uploadedFiles 
    });
  } catch (error) {
    console.error('Upload Error:', error);
    res.status(500).json({ message: 'Image upload failed', error: error.message });
  }
};

// @desc    Get all media
// @route   GET /api/admin/media
// @access  Private/Admin
export const getMedia = async (req, res) => {
    // Mock response for now, replace with DB call
    res.json({ media: [] });
};
