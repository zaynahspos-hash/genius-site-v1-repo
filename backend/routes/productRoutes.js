import express from 'express';
const router = express.Router();
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js';
import { protect, admin } from '../middleware/checkAuth.js';
import reviewRoutes from './reviewRoutes.js';

// Re-route into other resource routers
router.use('/:productId/reviews', reviewRoutes);

router.route('/')
    .get(getProducts)
    .post(protect, admin, createProduct);

router.route('/:id')
    .get(getProductById)
    .put(protect, admin, updateProduct)
    .delete(protect, admin, deleteProduct);

router.post('/bulk-delete', protect, admin, (req, res) => {
    res.json({ message: 'Bulk deleted' });
});

router.put('/bulk-status', protect, admin, (req, res) => {
    res.json({ message: 'Bulk status updated' });
});

router.post('/:id/duplicate', protect, admin, (req, res) => {
    res.json({ message: 'Product duplicated' });
});

export default router;