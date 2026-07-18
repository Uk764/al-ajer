"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cartController_1 = require("../controllers/cartController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
router.use(authMiddleware_1.protect); // every cart route requires login
router.get('/', cartController_1.getCart);
router.post('/add', cartController_1.addToCart);
router.put('/update', cartController_1.updateCartItem);
router.delete('/:productId', cartController_1.removeFromCart);
exports.default = router;
