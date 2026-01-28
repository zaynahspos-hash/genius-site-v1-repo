import mongoose from 'mongoose';

const categorySchema = mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: String,
  image: String,
  parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null },
  order: { type: Number, default: 0 }
}, {
  timestamps: true
});

const Category = mongoose.model('Category', categorySchema);
export default Category;