import { Router } from 'express';
import {
  createInquiry,
  getInquiries,
  updateInquiryStatus,
  deleteInquiry,
} from '../controllers/inquiryController';
import { protect, authorize } from '../middleware/authMiddleware';

const router = Router();

// Public route to submit inquiry (Contact Us form)
router.post('/', createInquiry);

// Protected admin routes for inquiry management
router.get('/', protect, authorize('admin', 'manager', 'staff'), getInquiries);
router.put('/:id/status', protect, authorize('admin', 'manager', 'staff'), updateInquiryStatus);
router.delete('/:id', protect, authorize('admin', 'manager'), deleteInquiry);

export default router;
