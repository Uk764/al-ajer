import { Router } from 'express';
import { upsertInventory, getInventoryByProduct } from '../controllers/inventoryController';

const router = Router();

router.post('/', upsertInventory);
router.get('/product/:productId', getInventoryByProduct);

export default router;