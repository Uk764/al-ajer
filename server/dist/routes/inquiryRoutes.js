"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const inquiryController_1 = require("../controllers/inquiryController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
// Public route to submit inquiry (Contact Us form)
router.post('/', inquiryController_1.createInquiry);
// Protected customer route to list their own inquiries
router.get('/my-inquiries', authMiddleware_1.protect, inquiryController_1.getMyInquiries);
// Protected admin routes for inquiry management
router.get('/', authMiddleware_1.protect, (0, authMiddleware_1.authorize)('admin', 'manager', 'staff'), inquiryController_1.getInquiries);
router.put('/:id', authMiddleware_1.protect, (0, authMiddleware_1.authorize)('admin', 'manager'), inquiryController_1.updateInquiry);
router.put('/:id/status', authMiddleware_1.protect, (0, authMiddleware_1.authorize)('admin', 'manager', 'staff'), inquiryController_1.updateInquiryStatus);
router.delete('/:id', authMiddleware_1.protect, (0, authMiddleware_1.authorize)('admin', 'manager'), inquiryController_1.deleteInquiry);
exports.default = router;
