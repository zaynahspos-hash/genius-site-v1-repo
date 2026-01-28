import express from 'express';
import { protect, admin } from '../middleware/checkAuth.js';

const router = express.Router();

// Mock data implementation to prevent 404s
// In production, these should be replaced with real controllers interacting with DB

router.get('/stats', protect, admin, (req, res) => {
    res.json({
        revenue: { value: 12500, trend: 15 },
        orders: { value: 150, trend: 8 },
        customers: { value: 89, trend: 12 },
        products: { value: 45, trend: 0 }
    });
});

router.get('/charts', protect, admin, (req, res) => {
    res.json({
        sales: [
            { date: 'Mon', sales: 4000, orders: 24 },
            { date: 'Tue', sales: 3000, orders: 13 },
            { date: 'Wed', sales: 2000, orders: 98 },
            { date: 'Thu', sales: 2780, orders: 39 },
            { date: 'Fri', sales: 1890, orders: 48 },
            { date: 'Sat', sales: 2390, orders: 38 },
            { date: 'Sun', sales: 3490, orders: 43 },
        ],
        categories: [
            { name: 'Electronics', value: 400 },
            { name: 'Clothing', value: 300 },
            { name: 'Home', value: 300 },
            { name: 'Books', value: 200 },
        ]
    });
});

router.get('/recent-orders', protect, admin, (req, res) => {
    res.json([
        { _id: '1', orderNumber: '1001', customerName: 'John Doe', total: 120.00, status: 'delivered', createdAt: new Date() },
        { _id: '2', orderNumber: '1002', customerName: 'Jane Smith', total: 85.50, status: 'processing', createdAt: new Date() }
    ]);
});

router.get('/top-products', protect, admin, (req, res) => {
    res.json([]);
});

router.get('/low-stock', protect, admin, (req, res) => {
    res.json([]);
});

export default router;