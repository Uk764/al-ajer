import { Response } from 'express';
import Cart from '../models/Cart';
import Product from '../models/Product';
import { AuthRequest } from '../middleware/authMiddleware';

export const getCart = async (req: AuthRequest, res: Response) => {
  try {
    let cart = await Cart.findOne({ user: req.user!.id }).populate(
      'items.product',
      'name slug sellingPrice thumbnailUrl'
    );

    if (!cart) {
      cart = await Cart.create({ user: req.user!.id, items: [] });
    }

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch cart', error });
  }
};

export const addToCart = async (req: AuthRequest, res: Response) => {
  try {
    const { productId, quantity } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    let cart = await Cart.findOne({ user: req.user!.id });
    if (!cart) {
      cart = await Cart.create({ user: req.user!.id, items: [] });
    }

    const existingItem = cart.items.find((item) => item.product.toString() === productId);

    if (existingItem) {
      existingItem.quantity += quantity || 1;
    } else {
      cart.items.push({ product: productId, quantity: quantity || 1 });
    }

    await cart.save();
    await cart.populate('items.product', 'name slug sellingPrice thumbnailUrl');

    res.status(200).json(cart);
  } catch (error) {
    res.status(400).json({ message: 'Failed to add to cart', error });
  }
};

export const updateCartItem = async (req: AuthRequest, res: Response) => {
  try {
    const { productId, quantity } = req.body;

    const cart = await Cart.findOne({ user: req.user!.id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const item = cart.items.find((item) => item.product.toString() === productId);
    if (!item) {
      return res.status(404).json({ message: 'Item not in cart' });
    }

    if (quantity <= 0) {
      cart.items = cart.items.filter((item) => item.product.toString() !== productId);
    } else {
      item.quantity = quantity;
    }

    await cart.save();
    await cart.populate('items.product', 'name slug sellingPrice thumbnailUrl');

    res.status(200).json(cart);
  } catch (error) {
    res.status(400).json({ message: 'Failed to update cart', error });
  }
};

export const removeFromCart = async (req: AuthRequest, res: Response) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: req.user!.id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = cart.items.filter((item) => item.product.toString() !== productId);
    await cart.save();
    await cart.populate('items.product', 'name slug sellingPrice thumbnailUrl');

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Failed to remove item', error });
  }
};