"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategory = exports.updateCategory = exports.getCategoryById = exports.getCategories = exports.createCategory = void 0;
const Category_1 = __importDefault(require("../models/Category"));
// Create a new category
const createCategory = async (req, res) => {
    try {
        const category = await Category_1.default.create(req.body);
        res.status(201).json(category);
    }
    catch (error) {
        res.status(400).json({ message: 'Failed to create category', error });
    }
};
exports.createCategory = createCategory;
// Get all categories
const getCategories = async (req, res) => {
    try {
        const categories = await Category_1.default.find().populate('parent', 'name slug');
        res.status(200).json(categories);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to fetch categories', error });
    }
};
exports.getCategories = getCategories;
// Get single category by ID
const getCategoryById = async (req, res) => {
    try {
        const category = await Category_1.default.findById(req.params.id).populate('parent', 'name slug');
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.status(200).json(category);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to fetch category', error });
    }
};
exports.getCategoryById = getCategoryById;
// Update category
const updateCategory = async (req, res) => {
    try {
        const category = await Category_1.default.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        }).populate('parent', 'name slug');
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.status(200).json(category);
    }
    catch (error) {
        res.status(400).json({ message: 'Failed to update category', error });
    }
};
exports.updateCategory = updateCategory;
// Delete category
const deleteCategory = async (req, res) => {
    try {
        const category = await Category_1.default.findByIdAndDelete(req.params.id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.status(200).json({ message: 'Category deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to delete category', error });
    }
};
exports.deleteCategory = deleteCategory;
