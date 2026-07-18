import { Router } from 'express';
import {
  createBrand,
  getBrands,
  getBrandById,
  updateBrand,
  deleteBrand,
} from '../controllers/brandController';
import { protect, authorize } from '../middleware/authMiddleware';

const router = Router();

router.get('/', getBrands);
router.get('/:id', getBrandById);
router.post('/', protect, authorize('admin', 'manager'), createBrand);
router.put('/:id', protect, authorize('admin', 'manager'), updateBrand);
router.delete('/:id', protect, authorize('admin', 'manager'), deleteBrand);

export default router;