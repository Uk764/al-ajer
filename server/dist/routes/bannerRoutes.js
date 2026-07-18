"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bannerController_1 = require("../controllers/bannerController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
// Public route for landing page
router.get('/', bannerController_1.getBanners);
// Protected administrative routes
router.get('/:id', authMiddleware_1.protect, (0, authMiddleware_1.authorize)('admin', 'manager', 'staff'), bannerController_1.getBannerById);
router.post('/', authMiddleware_1.protect, (0, authMiddleware_1.authorize)('admin', 'manager'), bannerController_1.createBanner);
router.put('/:id', authMiddleware_1.protect, (0, authMiddleware_1.authorize)('admin', 'manager'), bannerController_1.updateBanner);
router.delete('/:id', authMiddleware_1.protect, (0, authMiddleware_1.authorize)('admin', 'manager'), bannerController_1.deleteBanner);
exports.default = router;
