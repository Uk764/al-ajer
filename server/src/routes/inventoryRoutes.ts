import { Router } from 'express';
import { upsertInventory, getInventoryByProduct } from '../controllers/inventoryController';
import { protect, authorize } from '../middleware/authMiddleware';

const router = Router();

router.post('/', upsertInventory);
router.get('/product/:productId', getInventoryByProduct);
router.post('/', protect, authorize('admin', 'manager', 'staff'), upsertInventory);

export default router;