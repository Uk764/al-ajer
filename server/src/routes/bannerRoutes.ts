import { Router } from 'express';
import {
  createBanner,
  getBanners,
  getBannerById,
  updateBanner,
  deleteBanner,
} from '../controllers/bannerController';
import { protect, authorize } from '../middleware/authMiddleware';

const router = Router();

// Public route for landing page
router.get('/', getBanners);

// Protected administrative routes
router.get('/:id', protect, authorize('admin', 'manager', 'staff'), getBannerById);
router.post('/', protect, authorize('admin', 'manager'), createBanner);
router.put('/:id', protect, authorize('admin', 'manager'), updateBanner);
router.delete('/:id', protect, authorize('admin', 'manager'), deleteBanner);

export default router;
