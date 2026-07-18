import { Router } from 'express';
import {
  createBranch,
  getBranches,
  getBranchById,
  updateBranch,
  deleteBranch,
} from '../controllers/branchController';
import { protect, authorize } from '../middleware/authMiddleware';

const router = Router();

router.get('/', getBranches);
router.get('/:id', getBranchById);
router.post('/', protect, authorize('admin', 'manager'), createBranch);
router.put('/:id', protect, authorize('admin', 'manager'), updateBranch);
router.delete('/:id', protect, authorize('admin'), deleteBranch);

export default router;