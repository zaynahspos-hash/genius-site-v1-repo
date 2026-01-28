import express from 'express';
import asyncHandler from 'express-async-handler';
import Order from '../models/orderModel.js';
import Product from '../models/productModel.js'; // To update stock
import { protect, admin } from '../middleware/checkAuth.js';

const router = express.Router();

// @desc    Create new order (Public/Customer)
// @route   POST /api/orders
router.post('/', asyncHandler(async (req, res) => {
    const { orderItems, shippingAddress, paymentMethod, itemsPrice, shippingPrice, totalPrice, email, customerName } = req.body;

    if (orderItems && orderItems.length === 0) {
        res.status(400);
        throw new Error('No order items');
    }

    // Calculate totals server-side for security in real app, simplified here
    const subtotal = orderItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const orderNumber = Math.floor(100000 + Math.random() * 900000).toString();

    const order = new Order({
        orderNumber,
        items: orderItems.map(x => ({
            ...x,
            product: x.id || x._id // Ensure ref is set
        })),
        user: req.user ? req.user._id : undefined,
        customerName,
        guestEmail: email,
        shippingAddress,
        paymentMethod,
        subtotal,
        total: subtotal + (shippingPrice || 0), // Basic logic
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

// @desc    Get all orders (Admin)
// @route   GET /api/orders
router.get('/', protect, admin, asyncHandler(async (req, res) => {
    const pageSize = 20;
    const page = Number(req.query.pageNumber) || 1;
    const status = req.query.status;
    const search = req.query.search;

    let query = {};
    if (status) query.status = status;
    if (search) {
        query.$or = [
            { orderNumber: { $regex: search, $options: 'i' } },
            { customerName: { $regex: search, $options: 'i' } },
            { guestEmail: { $regex: search, $options: 'i' } }
        ];
    }

    const count = await Order.countDocuments(query);
    const orders = await Order.find(query)
        .sort({ createdAt: -1 })
        .limit(pageSize)
        .skip(pageSize * (page - 1));

    res.json({ orders, page, pages: Math.ceil(count / pageSize), count });
}));

// @desc    Get order by ID
// @route   GET /api/orders/:id
router.get('/:id', protect, admin, asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    if (order) {
        res.json(order);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
}));

// @desc    Update order status
// @route   PUT /api/orders/:id/status
router.put('/:id/status', protect, admin, asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
        order.status = req.body.status;
        order.timeline.push({ status: req.body.status, note: 'Status updated by admin' });
        if (req.body.status === 'delivered') order.deliveredAt = Date.now();
        
        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
}));

// @desc    Add note to order
// @route   POST /api/orders/:id/note
router.post('/:id/note', protect, admin, asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if(order) {
        order.timeline.push({ status: 'Note', note: req.body.note });
        await order.save();
        res.json(order);
    } else {
        res.status(404); throw new Error('Order not found');
    }
}));

export default router;