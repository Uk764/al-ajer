"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBrand = exports.updateBrand = exports.getBrandById = exports.getBrands = exports.createBrand = void 0;
const Brand_1 = __importDefault(require("../models/Brand"));
// Create a brand
const createBrand = async (req, res) => {
    try {
        const brand = await Brand_1.default.create(req.body);
        res.status(201).json(brand);
    }
    catch (error) {
        res.status(400).json({ message: 'Failed to create brand', error });
    }
};
exports.createBrand = createBrand;
// Get all brands
const getBrands = async (req, res) => {
    try {
        const brands = await Brand_1.default.find().sort({ name: 1 });
        res.status(200).json(brands);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to fetch brands', error });
    }
};
exports.getBrands = getBrands;
// Get single brand by ID
const getBrandById = async (req, res) => {
    try {
        const brand = await Brand_1.default.findById(req.params.id);
        if (!brand) {
            return res.status(404).json({ message: 'Brand not found' });
        }
        res.status(200).json(brand);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to fetch brand', error });
    }
};
exports.getBrandById = getBrandById;
// Update brand
const updateBrand = async (req, res) => {
    try {
        const brand = await Brand_1.default.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!brand) {
            return res.status(404).json({ message: 'Brand not found' });
        }
        res.status(200).json(brand);
    }
    catch (error) {
        res.status(400).json({ message: 'Failed to update brand', error });
    }
};
exports.updateBrand = updateBrand;
// Delete brand
const deleteBrand = async (req, res) => {
    try {
        const brand = await Brand_1.default.findByIdAndDelete(req.params.id);
        if (!brand) {
            return res.status(404).json({ message: 'Brand not found' });
        }
        res.status(200).json({ message: 'Brand deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to delete brand', error });
    }
};
exports.deleteBrand = deleteBrand;
