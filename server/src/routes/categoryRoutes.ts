import { Router } from 'express';
import {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from '../controllers/categoryController';
import { protect, authorize } from '../middleware/authMiddleware';

const router = Router();

router.get('/', getCategories);
router.get('/:id', getCategoryById);
router.post('/', protect, authorize('admin', 'manager'), createCategory);
router.put('/:id', protect, authorize('admin', 'manager'), updateCategory);
router.delete('/:id', protect, authorize('admin', 'manager'), deleteCategory);

export default router;