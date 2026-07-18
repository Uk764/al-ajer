"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOrderStatus = exports.getAllOrders = exports.getMyOrders = exports.createOrder = void 0;
const Order_1 = __importDefault(require("../models/Order"));
const Cart_1 = __importDefault(require("../models/Cart"));
const createOrder = async (req, res) => {
    try {
        const { shippingAddress, phone } = req.body;
        const cart = await Cart_1.default.findOne({ user: req.user.id }).populate('items.product', 'name sellingPrice');
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: 'Cart is empty' });
        }
        const orderItems = cart.items.map((item) => ({
            product: item.product._id,
            name: item.product.name,
            price: item.product.sellingPrice,
            quantity: item.quantity,
        }));
        const totalAmount = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const order = await Order_1.default.create({
            user: req.user.id,
            items: orderItems,
            totalAmount,
            shippingAddress,
            phone,
        });
        // Clear the cart after successful order creation
        cart.items = [];
        await cart.save();
        res.status(201).json(order);
    }
    catch (error) {
        res.status(400).json({ message: 'Failed to create order', error });
    }
};
exports.createOrder = createOrder;
const getMyOrders = async (req, res) => {
    try {
        const orders = await Order_1.default.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json(orders);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to fetch orders', error });
    }
};
exports.getMyOrders = getMyOrders;
// Admin/staff: view all orders
const getAllOrders = async (req, res) => {
    try {
        const orders = await Order_1.default.find().populate('user', 'name email').sort({ createdAt: -1 });
        res.status(200).json(orders);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to fetch orders', error });
    }
};
exports.getAllOrders = getAllOrders;
// Admin/staff: update order status
const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order_1.default.findByIdAndUpdate(req.params.id, { status }, { new: true });
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.status(200).json(order);
    }
    catch (error) {
        res.status(400).json({ message: 'Failed to update order status', error });
    }
};
exports.updateOrderStatus = updateOrderStatus;
