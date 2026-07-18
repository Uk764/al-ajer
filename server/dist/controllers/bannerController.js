"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBanner = exports.updateBanner = exports.getBannerById = exports.getBanners = exports.createBanner = void 0;
const Banner_1 = __importDefault(require("../models/Banner"));
const createBanner = async (req, res) => {
    try {
        const banner = await Banner_1.default.create(req.body);
        res.status(201).json(banner);
    }
    catch (error) {
        res.status(400).json({ message: error.message || 'Failed to create banner', error });
    }
};
exports.createBanner = createBanner;
const getBanners = async (req, res) => {
    try {
        const banners = await Banner_1.default.find().sort({ sortOrder: 1, createdAt: -1 });
        res.status(200).json(banners);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to fetch banners', error });
    }
};
exports.getBanners = getBanners;
const getBannerById = async (req, res) => {
    try {
        const banner = await Banner_1.default.findById(req.params.id);
        if (!banner) {
            return res.status(404).json({ message: 'Banner not found' });
        }
        res.status(200).json(banner);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to fetch banner', error });
    }
};
exports.getBannerById = getBannerById;
const updateBanner = async (req, res) => {
    try {
        const banner = await Banner_1.default.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!banner) {
            return res.status(404).json({ message: 'Banner not found' });
        }
        res.status(200).json(banner);
    }
    catch (error) {
        res.status(400).json({ message: error.message || 'Failed to update banner', error });
    }
};
exports.updateBanner = updateBanner;
const deleteBanner = async (req, res) => {
    try {
        const banner = await Banner_1.default.findByIdAndDelete(req.params.id);
        if (!banner) {
            return res.status(404).json({ message: 'Banner not found' });
        }
        res.status(200).json({ message: 'Banner deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to delete banner', error });
    }
};
exports.deleteBanner = deleteBanner;
