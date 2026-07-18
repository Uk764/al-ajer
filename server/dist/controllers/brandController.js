"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBrands = exports.createBrand = void 0;
const Brand_1 = __importDefault(require("../models/Brand"));
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
const getBrands = async (req, res) => {
    try {
        const brands = await Brand_1.default.find();
        res.status(200).json(brands);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to fetch brands', error });
    }
};
exports.getBrands = getBrands;
