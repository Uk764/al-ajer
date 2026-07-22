"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const reviewController_1 = require("../controllers/reviewController");
const router = express_1.default.Router();
router.post('/', authMiddleware_1.protect, reviewController_1.createReview);
router.get('/product/:productId', reviewController_1.getReviewsForProduct);
router.get('/my-reviews', authMiddleware_1.protect, reviewController_1.getMyReviews);
router.put('/:id', authMiddleware_1.protect, reviewController_1.updateReview);
router.delete('/:id', authMiddleware_1.protect, reviewController_1.deleteReview);
router.get('/admin/all', authMiddleware_1.protect, (0, authMiddleware_1.authorize)('admin', 'manager'), reviewController_1.getAllReviews);
exports.default = router;
