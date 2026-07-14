import { Response } from 'express';
import Order from '../models/Order';
import Cart from '../models/Cart';
import { AuthRequest } from '../middleware/authMiddleware';

export const createOrder = async (req: AuthRequest, res: Response) => {
  try {
    const { shippingAddress, phone } = req.body;

    const cart = await Cart.findOne({ user: req.user!.id }).populate<{
      items: { product: { _id: string; name: string; sellingPrice: number }; quantity: number }[];
    }>('items.product', 'name sellingPrice');

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    const orderItems = cart.items.map((item) => ({
      product: item.product._id,
      name: item.product.name,
      price: item.product.sellingPrice,
      quantity: item.quantity,
    }));

    const totalAmount = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const order = await Order.create({
      user: req.user!.id,
      items: orderItems,
      totalAmount,
      shippingAddress,
      phone,
    });

    // Clear the cart after successful order creation
    cart.items = [];
    await cart.save();

    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ message: 'Failed to create order', error });
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