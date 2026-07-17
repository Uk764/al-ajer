import { Router } from 'express';
import {
  createProduct,
  getProducts,
  getProductById,
  getProductBySlug,
  updateProduct,
  deleteProduct,
} from '../controllers/productController';
import { protect, authorize } from '../middleware/authMiddleware';

const router = Router();

router.post('/', protect, authorize('admin', 'manager'), createProduct);
router.get('/', getProducts);
router.get('/slug/:slug', getProductBySlug);
router.get('/:id', getProductById);
router.put('/:id', protect, authorize('admin', 'manager'), updateProduct);
router.delete('/:id', protect, authorize('admin'), deleteProduct);

export default router;