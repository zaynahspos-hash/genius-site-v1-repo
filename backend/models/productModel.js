import mongoose from 'mongoose';

const reviewSchema = mongoose.Schema({
  name: { type: String, required: true },
  rating: { type: Number, required: true },
  comment: { type: String, required: true },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
}, {
  timestamps: true,
});

const productSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  image: { type: String },
  images: [String],
  description: { type: String, required: true },
  category: { type: String }, // Name
  categoryId: { type: String }, // ID Reference
  price: { type: Number, required: true, default: 0 },
  comparePrice: { type: Number, default: 0 },
  costPrice: { type: Number, default: 0 },
  stock: { type: Number, required: true, default: 0 },
  sku: { type: String },
  tags: [String],
  variants: [{
    name: String,
    price: Number,
    stock: Number,
    sku: String,
    image: String
  }],
  status: { type: String, enum: ['active', 'draft', 'archived'], default: 'draft' },
  reviews: [reviewSchema],
  rating: { type: Number, required: true, default: 0 },
  numReviews: { type: Number, required: true, default: 0 },
  salesCount: { type: Number, default: 0 },
  isFeatured: { type: Boolean, default: false },
}, {
  timestamps: true,
});

const Product = mongoose.model('Product', productSchema);

export default Product;