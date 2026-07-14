import { Router } from 'express';
import { createOrder, getMyOrders, getAllOrders, updateOrderStatus } from '../controllers/orderController';
import { protect, authorize } from '../middleware/authMiddleware';

const router = Router();

router.use(protect);

router.post('/', createOrder);
router.get('/my-orders', getMyOrders);
router.get('/', authorize('admin', 'manager', 'staff'), getAllOrders);
router.put('/:id/status', authorize('admin', 'manager', 'staff'), updateOrderStatus);

export default router;