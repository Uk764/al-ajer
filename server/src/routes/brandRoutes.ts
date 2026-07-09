import { Router } from 'express';
import { createBrand, getBrands } from '../controllers/brandController';

const router = Router();

router.post('/', createBrand);
router.get('/', getBrands);

export default router;