import { Router } from 'express';
import {
  register,
  login,
  listCustomers,
  listStaff,
  createStaff,
  updateUser,
  deleteUser,
} from '../controllers/authController';
import { protect, authorize } from '../middleware/authMiddleware';

const router = Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Admin-only management routes
router.get('/customers', protect, authorize('admin', 'manager'), listCustomers);
router.get('/staff', protect, authorize('admin', 'manager'), listStaff);
router.post('/staff', protect, authorize('admin', 'manager'), createStaff);
router.put('/users/:id', protect, authorize('admin', 'manager'), updateUser);
router.delete('/users/:id', protect, authorize('admin'), deleteUser);

export default router;