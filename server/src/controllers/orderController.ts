import { Response } from 'express';
import mongoose from 'mongoose';
import Order from '../models/Order';
import Cart from '../models/Cart';
import Product from '../models/Product';
import { AuthRequest } from '../middleware/authMiddleware';

export const createOrder = async (req: AuthRequest, res: Response) => {
  const session = await mongoose.startSession();

  try {
    const { shippingAddress, phone } = req.body;

    session.startTransaction();

    const cart = await Cart.findOne({ user: req.user!.id })
      .populate<{
        items: { product: { _id: string; name: string; sellingPrice: number; stock: number }; quantity: number }[];
      }>('items.product', 'name sellingPrice stock')
      .session(session);

    if (!cart || cart.items.length === 0) {
      await session.abortTransaction();
      return res.status(400).json({ message: 'Cart is empty' });
    }

    const orderItems = [] as Array<{
      product: string;
      name: string;
      price: number;
      quantity: number;
    }>;

    for (const item of cart.items) {
      const productDoc = await Product.findById(item.product._id).session(session);

      if (!productDoc) {
        throw new Error(`Product ${item.product.name} was not found.`);
      }

      if (productDoc.stock < item.quantity) {
        throw new Error(`Insufficient stock for ${item.product.name}.`);
      }

      productDoc.stock -= item.quantity;
      await productDoc.save({ session });

      orderItems.push({
        product: item.product._id,
        name: item.product.name,
        price: item.product.sellingPrice,
        quantity: item.quantity,
      });
    }

    const totalAmount = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const order = new Order({
      user: req.user!.id,
      items: orderItems,
      totalAmount,
      shippingAddress,
      phone,
    });

    await order.save({ session });

    // Clear the cart after successful order creation
    cart.items = [];
    await cart.save({ session });

    await session.commitTransaction();

    res.status(201).json(order);
  } catch (error) {
    await session.abortTransaction();
    res.status(400).json({ message: 'Failed to create order', error });
  } finally {
    session.endSession();
  }
};

export const getMyOrders = async (req: AuthRequest, res: Response) => {
  try {
    const orders = await Order.find({ user: req.user!.id }).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch orders', error });
  }
};

// Admin/staff: view all orders
export const getAllOrders = async (req: AuthRequest, res: Response) => {
  try {
    const orders = await Order.find().populate('user', 'name email').sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch orders', error });
  }
};

// Admin/staff: update order status
export const updateOrderStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(400).json({ message: 'Failed to update order status', error });
  }
};