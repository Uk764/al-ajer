"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getReportSummary = void 0;
const Order_1 = __importDefault(require("../models/Order"));
const Product_1 = __importDefault(require("../models/Product"));
const User_1 = __importDefault(require("../models/User"));
const Inventory_1 = __importDefault(require("../models/Inventory"));
const getReportSummary = async (req, res) => {
    try {
        // 1. Core KPIs
        const totalOrders = await Order_1.default.countDocuments();
        const completedOrders = await Order_1.default.countDocuments({ status: 'delivered' });
        const pendingOrders = await Order_1.default.countDocuments({ status: 'pending' });
        // Aggregate total revenue (sum totalAmount for non-cancelled orders)
        const salesAggregate = await Order_1.default.aggregate([
            { $match: { status: { $ne: 'cancelled' } } },
            { $group: { _id: null, total: { $sum: '$totalAmount' } } },
        ]);
        const totalSales = salesAggregate[0]?.total || 0;
        const averageOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;
        // Out of stock warning count
        const lowStockCount = await Inventory_1.default.countDocuments({
            $expr: { $lte: ['$quantity', '$reorderLevel'] },
        });
        const totalCustomers = await User_1.default.countDocuments({ role: 'customer' });
        const totalProducts = await Product_1.default.countDocuments({ isActive: true });
        // 2. Recent orders (last 5)
        const recentOrders = await Order_1.default.find()
            .populate('user', 'name email')
            .sort({ createdAt: -1 })
            .limit(5);
        // 3. Sales by category
        // Let's get order items and map them to their product categories.
        // For simplicity, let's aggregate all delivered order items.
        const orders = await Order_1.default.find({ status: { $ne: 'cancelled' } });
        const categorySalesMap = {};
        // Get all products to lookup categories
        const products = await Product_1.default.find().populate('category', 'name');
        const productCategoryMap = new Map(products.map((p) => [p._id.toString(), p.category ? p.category.name : 'Uncategorized']));
        for (const order of orders) {
            for (const item of order.items) {
                const categoryName = productCategoryMap.get(item.product.toString()) || 'Uncategorized';
                categorySalesMap[categoryName] = (categorySalesMap[categoryName] || 0) + (item.price * item.quantity);
            }
        }
        const salesByCategory = Object.entries(categorySalesMap).map(([name, value]) => ({
            name,
            value,
        })).sort((a, b) => b.value - a.value);
        // 4. Top Selling Products
        const productVolumeMap = {};
        for (const order of orders) {
            for (const item of order.items) {
                const prodId = item.product.toString();
                if (!productVolumeMap[prodId]) {
                    productVolumeMap[prodId] = { name: item.name, quantity: 0, revenue: 0 };
                }
                productVolumeMap[prodId].quantity += item.quantity;
                productVolumeMap[prodId].revenue += item.price * item.quantity;
            }
        }
        const topProducts = Object.values(productVolumeMap)
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 5);
        // 5. Sales Trend (Last 7 days)
        const salesTrendMap = {};
        const dateLimit = new Date();
        dateLimit.setDate(dateLimit.getDate() - 7);
        const trendOrders = await Order_1.default.find({
            status: { $ne: 'cancelled' },
            createdAt: { $gte: dateLimit },
        });
        // Initialize map with last 7 days
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            salesTrendMap[dateStr] = 0;
        }
        for (const order of trendOrders) {
            const dateStr = new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            if (salesTrendMap[dateStr] !== undefined) {
                salesTrendMap[dateStr] += order.totalAmount;
            }
            else {
                salesTrendMap[dateStr] = order.totalAmount;
            }
        }
        const salesTrend = Object.entries(salesTrendMap).map(([date, amount]) => ({
            date,
            amount,
        }));
        res.status(200).json({
            summary: {
                totalSales,
                totalOrders,
                completedOrders,
                pendingOrders,
                averageOrderValue,
                lowStockCount,
                totalCustomers,
                totalProducts,
            },
            recentOrders,
            salesByCategory,
            topProducts,
            salesTrend,
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to generate report summary', error });
    }
};
exports.getReportSummary = getReportSummary;
