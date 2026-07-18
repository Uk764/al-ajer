"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
// Public routes
router.post('/register', authController_1.register);
router.post('/login', authController_1.login);
// Admin-only management routes
router.get('/customers', authMiddleware_1.protect, (0, authMiddleware_1.authorize)('admin', 'manager'), authController_1.listCustomers);
router.get('/staff', authMiddleware_1.protect, (0, authMiddleware_1.authorize)('admin', 'manager'), authController_1.listStaff);
router.post('/staff', authMiddleware_1.protect, (0, authMiddleware_1.authorize)('admin', 'manager'), authController_1.createStaff);
router.put('/users/:id', authMiddleware_1.protect, (0, authMiddleware_1.authorize)('admin', 'manager'), authController_1.updateUser);
router.delete('/users/:id', authMiddleware_1.protect, (0, authMiddleware_1.authorize)('admin'), authController_1.deleteUser);
exports.default = router;
