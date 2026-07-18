"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteInventory = exports.getAllInventory = exports.getInventoryByProduct = exports.upsertInventory = void 0;
const Inventory_1 = __importDefault(require("../models/Inventory"));
// Create or update stock for a product at a branch
const upsertInventory = async (req, res) => {
    try {
        const { product, branch, quantity, reorderLevel } = req.body;
        // "Upsert" = update if it exists, insert (create) if it doesn't
        const inventory = await Inventory_1.default.findOneAndUpdate({ product, branch }, { quantity, reorderLevel }, { new: true, upsert: true, runValidators: true });
        res.status(200).json(inventory);
    }
    catch (error) {
        res.status(400).json({ message: 'Failed to update inventory', error });
    }
};
exports.upsertInventory = upsertInventory;
// Get inventory for a specific product, across all branches
const getInventoryByProduct = async (req, res) => {
    try {
        const inventory = await Inventory_1.default.find({ product: req.params.productId })
            .populate('branch', 'name code');
        res.status(200).json(inventory);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to fetch inventory', error });
    }
};
exports.getInventoryByProduct = getInventoryByProduct;
// Get all inventory records across all products and branches
const getAllInventory = async (req, res) => {
    try {
        const inventory = await Inventory_1.default.find()
            .populate('product', 'name sku sellingPrice unit')
            .populate('branch', 'name code');
        res.status(200).json(inventory);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to fetch all inventory', error });
    }
};
exports.getAllInventory = getAllInventory;
// Delete inventory record
const deleteInventory = async (req, res) => {
    try {
        const inventory = await Inventory_1.default.findByIdAndDelete(req.params.id);
        if (!inventory) {
            return res.status(404).json({ message: 'Inventory record not found' });
        }
        res.status(200).json({ message: 'Inventory record deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to delete inventory record', error });
    }
};
exports.deleteInventory = deleteInventory;
