import { Router } from 'express';
import { createCategory, getCategories } from '../controllers/categoryController';
import { protect, authorize } from '../middleware/authMiddleware';

const router = Router();

router.post('/', createCategory);
router.get('/', getCategories);
router.post('/', protect, authorize('admin', 'manager'), createCategory);

export default router;