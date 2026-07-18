"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const reportController_1 = require("../controllers/reportController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
router.get('/summary', authMiddleware_1.protect, (0, authMiddleware_1.authorize)('admin', 'manager'), reportController_1.getReportSummary);
exports.default = router;
