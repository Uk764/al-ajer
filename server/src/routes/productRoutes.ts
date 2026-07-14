import { Router } from 'express';
import { createProduct, getProducts, getProductById, getProductBySlug } from '../controllers/productController';
import { protect, authorize } from '../middleware/authMiddleware';

const router = Router();

router.post('/', protect, authorize('admin', 'manager'), createProduct);
router.get('/', getProducts);
router.get('/slug/:slug', getProductBySlug);
router.get('/:id', getProductById);

export default router;