import { Router } from 'express';
import {
  createCoupon,
  getCoupons,
  getCouponById,
  updateCoupon,
  deleteCoupon,
} from '../controllers/couponController';
import { protect, authorize } from '../middleware/authMiddleware';

const router = Router();

router.get('/', protect, authorize('admin', 'manager', 'staff'), getCoupons);
router.get('/:id', protect, authorize('admin', 'manager', 'staff'), getCouponById);
router.post('/', protect, authorize('admin', 'manager'), createCoupon);
router.put('/:id', protect, authorize('admin', 'manager'), updateCoupon);
router.delete('/:id', protect, authorize('admin', 'manager'), deleteCoupon);

export default router;
