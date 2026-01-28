import mongoose from 'mongoose';

const couponSchema = mongoose.Schema({
  code: { type: String, required: true, unique: true, uppercase: true },
  discountType: { type: String, enum: ['percentage', 'fixed'], required: true },
  value: { type: Number, required: true },
  minPurchase: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  usageLimit: { type: Number },
  usedCount: { type: Number, default: 0 },
  expiryDate: Date
}, {
  timestamps: true
});

const Coupon = mongoose.model('Coupon', couponSchema);
export default Coupon;