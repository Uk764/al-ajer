"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllReviews = exports.deleteReview = exports.updateReview = exports.getMyReviews = exports.getReviewsForProduct = exports.createReview = void 0;
const Review_1 = __importDefault(require("../models/Review"));
const Order_1 = __importDefault(require("../models/Order"));
const Product_1 = __importDefault(require("../models/Product"));
const createReview = async (req, res) => {
    try {
        if (!req.user)
            return res.status(401).json({ message: 'Not authorized' });
        const { productId, rating, comment } = req.body;
        if (!productId || !rating || !comment) {
            return res.status(400).json({ message: 'Product, rating, and comment are required' });
        }
        const hasPurchased = await Order_1.default.exists({
            user: req.user.id,
            status: { $in: ['confirmed', 'shipped', 'delivered'] },
            'items.product': productId,
        });
        if (!hasPurchased) {
            return res.status(403).json({ message: 'Only customers who purchased this product can leave a review' });
        }
        const existingReview = await Review_1.default.findOne({ product: productId, user: req.user.id });
        if (existingReview) {
            return res.status(409).json({ message: 'You have already reviewed this product' });
        }
        const review = await Review_1.default.create({
            product: productId,
            user: req.user.id,
            rating: Number(rating),
            comment: comment.trim(),
        });
        const reviewSummary = await Review_1.default.aggregate([
            { $match: { product: review.product, isApproved: true } },
            { $group: { _id: null, averageRating: { $avg: '$rating' }, totalReviews: { $sum: 1 } } },
        ]);
        const summary = reviewSummary[0] || { averageRating: 0, totalReviews: 0 };
        await Product_1.default.findByIdAndUpdate(productId, {
            ratingAverage: summary.averageRating,
            ratingCount: summary.totalReviews,
        });
        res.status(201).json(review);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to create review', error });
    }
};
exports.createReview = createReview;
const getReviewsForProduct = async (req, res) => {
    try {
        const reviews = await Review_1.default.find({ product: req.params.productId, isApproved: true })
            .populate('user', 'name email')
            .sort({ createdAt: -1 });
        res.status(200).json(reviews);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to fetch reviews', error });
    }
};
exports.getReviewsForProduct = getReviewsForProduct;
const getMyReviews = async (req, res) => {
    try {
        if (!req.user)
            return res.status(401).json({ message: 'Not authorized' });
        const reviews = await Review_1.default.find({ user: req.user.id })
            .populate('product', 'name slug')
            .sort({ createdAt: -1 });
        res.status(200).json(reviews);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to fetch your reviews', error });
    }
};
exports.getMyReviews = getMyReviews;
const updateReview = async (req, res) => {
    try {
        if (!req.user)
            return res.status(401).json({ message: 'Not authorized' });
        const review = await Review_1.default.findById(req.params.id);
        if (!review)
            return res.status(404).json({ message: 'Review not found' });
        if (review.user.toString() !== req.user.id)
            return res.status(403).json({ message: 'Not your review' });
        review.rating = Number(req.body.rating);
        review.comment = req.body.comment.trim();
        await review.save();
        const reviewSummary = await Review_1.default.aggregate([
            { $match: { product: review.product, isApproved: true } },
            { $group: { _id: null, averageRating: { $avg: '$rating' }, totalReviews: { $sum: 1 } } },
        ]);
        const summary = reviewSummary[0] || { averageRating: 0, totalReviews: 0 };
        await Product_1.default.findByIdAndUpdate(review.product, {
            ratingAverage: summary.averageRating,
            ratingCount: summary.totalReviews,
        });
        res.status(200).json(review);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to update review', error });
    }
};
exports.updateReview = updateReview;
const deleteReview = async (req, res) => {
    try {
        if (!req.user)
            return res.status(401).json({ message: 'Not authorized' });
        const review = await Review_1.default.findById(req.params.id);
        if (!review)
            return res.status(404).json({ message: 'Review not found' });
        if (req.user.role !== 'admin' && review.user.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not allowed' });
        }
        const productId = review.product;
        await review.deleteOne();
        const reviewSummary = await Review_1.default.aggregate([
            { $match: { product: productId, isApproved: true } },
            { $group: { _id: null, averageRating: { $avg: '$rating' }, totalReviews: { $sum: 1 } } },
        ]);
        const summary = reviewSummary[0] || { averageRating: 0, totalReviews: 0 };
        await Product_1.default.findByIdAndUpdate(productId, {
            ratingAverage: summary.averageRating,
            ratingCount: summary.totalReviews,
        });
        res.status(200).json({ message: 'Review removed successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to delete review', error });
    }
};
exports.deleteReview = deleteReview;
const getAllReviews = async (req, res) => {
    try {
        const reviews = await Review_1.default.find()
            .populate('product', 'name slug')
            .populate('user', 'name email')
            .sort({ createdAt: -1 });
        res.status(200).json(reviews);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to fetch reviews', error });
    }
};
exports.getAllReviews = getAllReviews;
