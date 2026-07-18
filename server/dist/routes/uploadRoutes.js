"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = require("../config/multer");
const uploadController_1 = require("../controllers/uploadController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
router.post('/', authMiddleware_1.protect, (0, authMiddleware_1.authorize)('admin', 'manager'), multer_1.uploadImage.single('image'), uploadController_1.uploadImage);
exports.default = router;
