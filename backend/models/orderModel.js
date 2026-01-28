import mongoose from 'mongoose';

const orderSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  guestEmail: { type: String },
  customerName: { type: String, required: true },
  orderNumber: { type: String, required: true, unique: true },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    productTitle: String,
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    image: String,
    variantSku: String,
    variantName: String
  }],
  shippingAddress: {
    street: String,
    city: String,
    state: String,
    zip: String,
    country: String
  },
  paymentMethod: { type: String, required: true },
  paymentStatus: { type: String, default: 'pending' }, // pending, paid, failed
  status: { 
    type: String, 
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'], 
    default: 'pending' 
  },
  total: { type: Number, required: true },
  subtotal: { type: Number, required: true },
  shippingFee: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  couponCode: String,
  timeline: [{
    status: String,
    note: String,
    date: { type: Date, default: Date.now }
  }],
  isPaid: { type: Boolean, default: false },
  paidAt: Date,
  deliveredAt: Date,
}, {
  timestamps: true
});

const Order = mongoose.model('Order', orderSchema);
export default Order;