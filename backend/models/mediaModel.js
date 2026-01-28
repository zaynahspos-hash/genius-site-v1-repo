import mongoose from 'mongoose';

const mediaSchema = mongoose.Schema({
  url: { type: String, required: true },
  public_id: String,
  filename: String,
  size: Number,
  type: String, // image, video
  folder: { type: mongoose.Schema.Types.ObjectId, ref: 'Folder' },
  alt: String
}, {
  timestamps: true
});

const folderSchema = mongoose.Schema({
  name: { type: String, required: true },
  parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Folder' }
});

export const Folder = mongoose.model('Folder', folderSchema);
export const Media = mongoose.model('Media', mediaSchema);