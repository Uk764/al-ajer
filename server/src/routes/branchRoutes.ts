import { Router } from 'express';
import { createBranch, getBranches } from '../controllers/branchController';

const router = Router();

router.post('/', createBranch);
router.get('/', getBranches);

export default router;