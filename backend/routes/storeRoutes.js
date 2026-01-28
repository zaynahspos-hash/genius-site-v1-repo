import express from 'express';
import asyncHandler from 'express-async-handler';
import Product from '../models/productModel.js';
import Order from '../models/orderModel.js';

const router = express.Router();

// @desc    Get store config
// @route   GET /api/store/init
router.get('/init', (req, res) => {
    res.json({
        storeName: 'ShopGenius',
        currency: 'USD',
        maintenance: false
    });
});

// @desc    Public get products wrapper
// @route   GET /api/store/products
router.get('/products', asyncHandler(async (req, res) => {
    const pageSize = Number(req.query.limit) || 12;
    const query = {};
    
    if (req.query.search) {
        query.title = { $regex: req.query.search, $options: 'i' };
    }
    if (req.query.category) {
        query.category = req.query.category;
    }
    
    const products = await Product.find(query).limit(pageSize);
    const count = await Product.countDocuments(query);
    
    res.json({ products, count, page: 1, pages: 1 });
}));

// @desc    Get single product by slug
// @route   GET /api/store/products/:slug
router.get('/products/:slug', asyncHandler(async (req, res) => {
    const product = await Product.findOne({ slug: req.params.slug });
    if (product) {
        res.json(product);
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
}));

// @desc    Newsletter signup
// @route   POST /api/store/newsletter
router.post('/newsletter', (req, res) => {
    res.json({ message: 'Subscribed successfully' });
});

// @desc    Check Coupon
// @route   POST /api/store/cart/coupon
router.post('/cart/coupon', (req, res) => {
    const { code, cartTotal } = req.body;
    
    // Mock Logic
    if (code === 'WELCOME10') {
        res.json({
            code: 'WELCOME10',
            coupon: 'Welcome Discount',
            discount: cartTotal * 0.10, // 10%
            type: 'percentage'
        });
    } else if (code === 'SAVE20') {
        res.json({
            code: 'SAVE20',
            coupon: 'Save 20',
            discount: 20,
            type: 'fixed'
        });
    } else {
        res.status(400);
        throw new Error('Invalid coupon code');
    }
});

// @desc    Checkout Process
// @route   POST /api/store/checkout
router.post('/checkout', asyncHandler(async (req, res) => {
    const { orderItems, shippingAddress, paymentMethod, itemsPrice, shippingPrice, totalPrice, email, customerName } = req.body;

    if (orderItems && orderItems.length === 0) {
        res.status(400);
        throw new Error('No order items');
    }

    const subtotal = orderItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const orderNumber = Math.floor(100000 + Math.random() * 900000).toString();

    const order = new Order({
        orderNumber,
        items: orderItems.map(x => ({
            ...x,
            product: x.id || x._id 
        })),
        customerName,
        guestEmail: email,
        shippingAddress,
        paymentMethod,
        subtotal,
        total: subtotal + (shippingPrice || 0), 
        status: 'pending'
    });

    const createdOrder = await order.save();

    // Decrease Stock
    for (const item of orderItems) {
        const product = await Product.findById(item.id || item._id);
        if (product) {
            product.stock = Math.max(0, product.stock - item.quantity);
            product.salesCount = (product.salesCount || 0) + item.quantity;
            await product.save();
        }
    }

    res.status(201).json(createdOrder);
}));

export default router;