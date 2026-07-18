"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCoupon = exports.updateCoupon = exports.getCouponById = exports.getCoupons = exports.createCoupon = void 0;
const Coupon_1 = __importDefault(require("../models/Coupon"));
const createCoupon = async (req, res) => {
    try {
        const coupon = await Coupon_1.default.create(req.body);
        res.status(201).json(coupon);
    }
    catch (error) {
        res.status(400).json({ message: error.message || 'Failed to create coupon', error });
    }
};
exports.createCoupon = createCoupon;
const getCoupons = async (req, res) => {
    try {
        const coupons = await Coupon_1.default.find().sort({ createdAt: -1 });
        res.status(200).json(coupons);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to fetch coupons', error });
    }
};
exports.getCoupons = getCoupons;
const getCouponById = async (req, res) => {
    try {
        const coupon = await Coupon_1.default.findById(req.params.id);
        if (!coupon) {
            return res.status(404).json({ message: 'Coupon not found' });
        }
        res.status(200).json(coupon);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to fetch coupon', error });
    }
};
exports.getCouponById = getCouponById;
const updateCoupon = async (req, res) => {
    try {
        const coupon = await Coupon_1.default.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!coupon) {
            return res.status(404).json({ message: 'Coupon not found' });
        }
        res.status(200).json(coupon);
    }
    catch (error) {
        res.status(400).json({ message: error.message || 'Failed to update coupon', error });
    }
};
exports.updateCoupon = updateCoupon;
const deleteCoupon = async (req, res) => {
    try {
        const coupon = await Coupon_1.default.findByIdAndDelete(req.params.id);
        if (!coupon) {
            return res.status(404).json({ message: 'Coupon not found' });
        }
        res.status(200).json({ message: 'Coupon deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to delete coupon', error });
    }
};
exports.deleteCoupon = deleteCoupon;
