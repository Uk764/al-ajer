import { Router } from 'express';
import { createBranch, getBranches } from '../controllers/branchController';
import { protect, authorize } from '../middleware/authMiddleware';

const router = Router();

router.post('/', createBranch);
router.get('/', getBranches);
router.post('/', protect, authorize('admin'), createBranch);

export default router;