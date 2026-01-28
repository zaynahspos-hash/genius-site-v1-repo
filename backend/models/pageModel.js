import mongoose from 'mongoose';

const pageSchema = mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  content: { type: String, required: true },
  template: { type: String, default: 'default' }, // default, full-width, contact, about
  status: { type: String, enum: ['published', 'draft'], default: 'published' },
  showInNav: { type: Boolean, default: false }
}, {
  timestamps: true
});

const Page = mongoose.model('Page', pageSchema);
export default Page;