import { Router } from 'express';
import { uploadSpreadsheet } from '../config/multer';
import { bulkImportProducts } from '../controllers/bulkImportController';
import { protect, authorize } from '../middleware/authMiddleware';

const router = Router();

router.post('/products', protect, authorize('admin', 'manager'), uploadSpreadsheet.single('file'), bulkImportProducts);

export default router;