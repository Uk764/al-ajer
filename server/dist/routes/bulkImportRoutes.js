"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = require("../config/multer");
const bulkImportController_1 = require("../controllers/bulkImportController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
router.post('/products', authMiddleware_1.protect, (0, authMiddleware_1.authorize)('admin', 'manager'), multer_1.uploadSpreadsheet.single('file'), bulkImportController_1.bulkImportProducts);
exports.default = router;
