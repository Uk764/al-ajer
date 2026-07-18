"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateProduct = exports.getProductBySlug = exports.getProductById = exports.getProducts = exports.createProduct = void 0;
const Product_1 = __importDefault(require("../models/Product"));
const Inventory_1 = __importDefault(require("../models/Inventory"));
const createProduct = async (req, res) => {
    try {
        const product = await Product_1.default.create(req.body);
        res.status(201).json(product);
    }
    catch (error) {
        res.status(400).json({ message: 'Failed to create product', error });
    }
};
exports.createProduct = createProduct;
const getProducts = async (req, res) => {
    try {
        // Read query params, with sensible defaults if not provided
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;
        // Build a MongoDB filter object based on which query params were sent
        const filter = { isActive: true };
        if (req.query.category) {
            filter.category = req.query.category;
        }
        if (req.query.brand) {
            filter.brand = req.query.brand;
        }
        if (req.query.minPrice || req.query.maxPrice) {
            filter.sellingPrice = {};
            if (req.query.minPrice)
                filter.sellingPrice.$gte = Number(req.query.minPrice);
            if (req.query.maxPrice)
                filter.sellingPrice.$lte = Number(req.query.maxPrice);
        }
        if (req.query.search) {
            filter.$text = { $search: req.query.search };
        }
        if (req.query.onSale === 'true') {
            filter.discountedPrice = { $ne: null, $gt: 0 };
        }
        if (req.query.inStock === 'true') {
            const inStockProductIds = await Inventory_1.default.find({ quantity: { $gt: 0 } }).distinct('product');
            filter._id = { $in: inStockProductIds };
        }
        // Build sort object
        let sortOption = { createdAt: -1 }; // default: newest first
        if (req.query.sort === 'price_asc')
            sortOption = { sellingPrice: 1 };
        if (req.query.sort === 'price_asc')
            sortOption = { sellingPrice: 1 };
        if (req.query.sort === 'price_desc')
            sortOption = { sellingPrice: -1 };
        if (req.query.sort === 'name_asc')
            sortOption = { name: 1 };
        // Run the query and count total matches in parallel
        const [products, total] = await Promise.all([
            Product_1.default.find(filter)
                .populate('category', 'name slug')
                .populate('brand', 'name slug')
                .sort(sortOption)
                .skip(skip)
                .limit(limit),
            Product_1.default.countDocuments(filter),
        ]);
        res.status(200).json({
            products,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to fetch products', error });
    }
};
exports.getProducts = getProducts;
const getProductById = async (req, res) => {
    try {
        const product = await Product_1.default.findById(req.params.id)
            .populate('category', 'name slug')
            .populate('brand', 'name slug');
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(product);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to fetch product', error });
    }
};
exports.getProductById = getProductById;
const getProductBySlug = async (req, res) => {
    try {
        const product = await Product_1.default.findOne({ slug: req.params.slug })
            .populate('category', 'name slug')
            .populate('brand', 'name slug');
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(product);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to fetch product', error });
    }
};
exports.getProductBySlug = getProductBySlug;
const updateProduct = async (req, res) => {
    try {
        const product = await Product_1.default.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        })
            .populate('category', 'name slug')
            .populate('brand', 'name slug');
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(product);
    }
    catch (error) {
        res.status(400).json({ message: 'Failed to update product', error });
    }
};
exports.updateProduct = updateProduct;
const deleteProduct = async (req, res) => {
    try {
        const product = await Product_1.default.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json({ message: 'Product deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to delete product', error });
    }
};
exports.deleteProduct = deleteProduct;
