import { Router } from 'express';
import { getReportSummary } from '../controllers/reportController';
import { protect, authorize } from '../middleware/authMiddleware';

const router = Router();

router.get('/summary', protect, authorize('admin', 'manager'), getReportSummary);

export default router;
