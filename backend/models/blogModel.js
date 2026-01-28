import mongoose from 'mongoose';

const blogSchema = mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  content: { type: String, required: true },
  excerpt: String,
  image: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' }, // Optional link to product categories or separate blog cats
  status: { type: String, enum: ['draft', 'published', 'scheduled'], default: 'draft' },
  publishDate: { type: Date, default: Date.now },
  tags: [String]
}, {
  timestamps: true
});

const BlogPost = mongoose.model('BlogPost', blogSchema);
export default BlogPost;