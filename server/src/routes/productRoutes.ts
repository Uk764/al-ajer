import { Router } from 'express';
import { createProduct, getProducts, getProductById } from '../controllers/productController';
import { protect, authorize } from '../middleware/authMiddleware';

const router = Router();

router.post('/', protect, authorize('admin', 'manager'), createProduct);
router.get('/', getProducts);
router.get('/:id', getProductById);

export default router;