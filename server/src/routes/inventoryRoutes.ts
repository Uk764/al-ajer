import { Router } from 'express';
import {
  upsertInventory,
  getInventoryByProduct,
  getAllInventory,
  deleteInventory,
} from '../controllers/inventoryController';
import { protect, authorize } from '../middleware/authMiddleware';

const router = Router();

router.get('/product/:productId', getInventoryByProduct);
router.get('/', protect, authorize('admin', 'manager', 'staff'), getAllInventory);
router.post('/', protect, authorize('admin', 'manager', 'staff'), upsertInventory);
router.delete('/:id', protect, authorize('admin', 'manager'), deleteInventory);

export default router;