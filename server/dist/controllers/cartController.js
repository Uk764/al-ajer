"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeFromCart = exports.updateCartItem = exports.addToCart = exports.getCart = void 0;
const Cart_1 = __importDefault(require("../models/Cart"));
const Product_1 = __importDefault(require("../models/Product"));
const getCart = async (req, res) => {
    try {
        let cart = await Cart_1.default.findOne({ user: req.user.id }).populate('items.product', 'name slug sellingPrice thumbnailUrl');
        if (!cart) {
            cart = await Cart_1.default.create({ user: req.user.id, items: [] });
        }
        res.status(200).json(cart);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to fetch cart', error });
    }
};
exports.getCart = getCart;
const addToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const product = await Product_1.default.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        let cart = await Cart_1.default.findOne({ user: req.user.id });
        if (!cart) {
            cart = await Cart_1.default.create({ user: req.user.id, items: [] });
        }
        const existingItem = cart.items.find((item) => item.product.toString() === productId);
        if (existingItem) {
            existingItem.quantity += quantity || 1;
        }
        else {
            cart.items.push({ product: productId, quantity: quantity || 1 });
        }
        await cart.save();
        await cart.populate('items.product', 'name slug sellingPrice thumbnailUrl');
        res.status(200).json(cart);
    }
    catch (error) {
        res.status(400).json({ message: 'Failed to add to cart', error });
    }
};
exports.addToCart = addToCart;
const updateCartItem = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const cart = await Cart_1.default.findOne({ user: req.user.id });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }
        const item = cart.items.find((item) => item.product.toString() === productId);
        if (!item) {
            return res.status(404).json({ message: 'Item not in cart' });
        }
        if (quantity <= 0) {
            cart.items = cart.items.filter((item) => item.product.toString() !== productId);
        }
        else {
            item.quantity = quantity;
        }
        await cart.save();
        await cart.populate('items.product', 'name slug sellingPrice thumbnailUrl');
        res.status(200).json(cart);
    }
    catch (error) {
        res.status(400).json({ message: 'Failed to update cart', error });
    }
};
exports.updateCartItem = updateCartItem;
const removeFromCart = async (req, res) => {
    try {
        const { productId } = req.params;
        const cart = await Cart_1.default.findOne({ user: req.user.id });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }
        cart.items = cart.items.filter((item) => item.product.toString() !== productId);
        await cart.save();
        await cart.populate('items.product', 'name slug sellingPrice thumbnailUrl');
        res.status(200).json(cart);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to remove item', error });
    }
};
exports.removeFromCart = removeFromCart;
