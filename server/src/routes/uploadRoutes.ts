import { Router } from 'express';
import { uploadImage as uploadImageMiddleware } from '../config/multer';
import { uploadImage as uploadImageController } from '../controllers/uploadController';
import { protect, authorize } from '../middleware/authMiddleware';

const router = Router();

router.post('/', protect, authorize('admin', 'manager'), uploadImageMiddleware.single('image'), uploadImageController);

export default router;