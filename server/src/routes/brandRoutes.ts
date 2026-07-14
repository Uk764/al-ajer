import { Router } from 'express';
import { createBrand, getBrands } from '../controllers/brandController';
import { protect, authorize } from '../middleware/authMiddleware';

const router = Router();

router.post('/', createBrand);
router.get('/', getBrands);
router.post('/', protect, authorize('admin', 'manager'), createBrand);

export default router;