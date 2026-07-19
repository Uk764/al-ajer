import { Response } from 'express';
import Order from '../models/Order';
import Product from '../models/Product';
import Category from '../models/Category';
import User from '../models/User';
import Inventory from '../models/Inventory';
import { AuthRequest } from '../middleware/authMiddleware';

export const getReportSummary = async (req: AuthRequest, res: Response) => {
  try {
    // 1. Core KPIs
    const totalOrders = await Order.countDocuments();
    const completedOrders = await Order.countDocuments({ status: 'delivered' });
    const pendingOrders = await Order.countDocuments({ status: 'pending' });

    // Aggregate total revenue (sum totalAmount for non-cancelled orders)
    const salesAggregate = await Order.aggregate([
      { $match: { status: { $ne: 'cancelled' } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]);
    const totalSales = salesAggregate[0]?.total || 0;
    const averageOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;

    // Out of stock warning count
    const lowStockCount = await Inventory.countDocuments({
      $expr: { $lte: ['$quantity', '$reorderLevel'] },
    });

    const totalCustomers = await User.countDocuments({ role: 'customer' });
    const totalProducts = await Product.countDocuments({ isActive: true });

    // 2. Recent orders (last 5)
    const recentOrders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);

    // Recent customers (last 5)
    const recentCustomers = await User.find({ role: 'customer' })
      .select('name email phone createdAt')
      .sort({ createdAt: -1 })
      .limit(5);

    // 3. Sales by category
    // Let's get order items and map them to their product categories.
    // For simplicity, let's aggregate all delivered order items.
    const orders = await Order.find({ status: { $ne: 'cancelled' } });
    const categorySalesMap: Record<string, number> = {};

    // Get all products to lookup categories
    const products = await Product.find().populate('category', 'name');
    const productCategoryMap = new Map(products.map((p) => [p._id.toString(), p.category ? (p.category as any).name : 'Uncategorized']));

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
    const productVolumeMap: Record<string, { name: string; quantity: number; revenue: number }> = {};
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
    const salesTrendMap: Record<string, number> = {};
    const dateLimit = new Date();
    dateLimit.setDate(dateLimit.getDate() - 7);

    const trendOrders = await Order.find({
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
      } else {
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
      recentCustomers,
      salesByCategory,
      topProducts,
      salesTrend,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to generate report summary', error });
  }
};
