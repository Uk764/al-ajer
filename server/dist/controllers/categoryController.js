"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCategories = exports.createCategory = void 0;
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
        const categories = await Category_1.default.find();
        res.status(200).json(categories);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to fetch categories', error });
    }
};
exports.getCategories = getCategories;
