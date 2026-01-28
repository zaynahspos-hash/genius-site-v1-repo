import express from 'express';
import { protect, admin } from '../middleware/checkAuth.js';

const router = express.Router();

// Sales Report
router.get('/sales', protect, admin, (req, res) => {
    res.json({
        summary: {
            totalRevenue: 15430.00,
            totalOrders: 142,
            avgOrderValue: 108.66
        },
        chart: [
            { date: '2024-01-01', revenue: 1200 },
            { date: '2024-01-02', revenue: 1900 },
            { date: '2024-01-03', revenue: 1500 },
            { date: '2024-01-04', revenue: 2200 },
            { date: '2024-01-05', revenue: 1800 },
            { date: '2024-01-06', revenue: 3100 },
            { date: '2024-01-07', revenue: 2800 },
        ]
    });
});

router.get('/sales/breakdown', protect, admin, (req, res) => {
    res.json({
        byCategory: [
            { _id: 'Electronics', value: 5000 },
            { _id: 'Fashion', value: 3500 },
            { _id: 'Home', value: 2000 },
            { _id: 'Beauty', value: 1500 },
        ]
    });
});

// Orders Report
router.get('/orders', protect, admin, (req, res) => {
    res.json({
        statusBreakdown: [
            { name: 'Delivered', value: 80 },
            { name: 'Processing', value: 25 },
            { name: 'Shipped', value: 30 },
            { name: 'Cancelled', value: 7 },
        ]
    });
});

// Customers Report
router.get('/customers', protect, admin, (req, res) => {
    res.json({
        topCustomers: [
            { _id: '1', name: 'John Doe', email: 'john@example.com', totalOrders: 5, totalSpent: 520 },
            { _id: '2', name: 'Jane Smith', email: 'jane@example.com', totalOrders: 3, totalSpent: 340 },
        ],
        growth: [
            { _id: 'Jan', count: 10 },
            { _id: 'Feb', count: 15 },
            { _id: 'Mar', count: 25 },
        ]
    });
});

// Inventory Report
router.get('/inventory', protect, admin, (req, res) => {
    res.json({
        summary: {
            totalValue: 45000,
            lowStockCount: 5,
            outOfStockCount: 2
        },
        inventory: [
            { title: 'Wireless Headphones', stock: 5, status: 'Low' },
            { title: 'Gaming Mouse', stock: 0, status: 'Out' },
            { title: 'Mechanical Keyboard', stock: 12, status: 'In Stock' }
        ]
    });
});

// Export Data
router.post('/export', protect, admin, (req, res) => {
    // Return a CSV string
    const csv = `Date,Revenue,Orders\n2024-01-01,1200,10\n2024-01-02,1900,15`;
    res.send(csv);
});

export default router;