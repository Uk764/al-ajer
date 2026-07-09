import { Request, Response } from 'express';
import Product from '../models/Product';

export const createProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: 'Failed to create product', error });
  }
};

export const getProducts = async (req: Request, res: Response) => {
  try {
    // Read query params, with sensible defaults if not provided
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    // Build a MongoDB filter object based on which query params were sent
    const filter: Record<string, any> = { isActive: true };

    if (req.query.category) {
      filter.category = req.query.category;
    }
    if (req.query.brand) {
      filter.brand = req.query.brand;
    }
    if (req.query.minPrice || req.query.maxPrice) {
      filter.sellingPrice = {};
      if (req.query.minPrice) filter.sellingPrice.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice) filter.sellingPrice.$lte = Number(req.query.maxPrice);
    }
    if (req.query.search) {
      filter.$text = { $search: req.query.search as string };
    }

    // Build sort object
    let sortOption: Record<string, 1 | -1> = { createdAt: -1 }; // default: newest first
    if (req.query.sort === 'price_asc') sortOption = { sellingPrice: 1 };
    if (req.query.sort === 'price_asc') sortOption = { sellingPrice: 1 };
    if (req.query.sort === 'price_desc') sortOption = { sellingPrice: -1 };
    if (req.query.sort === 'name_asc') sortOption = { name: 1 };

    // Run the query and count total matches in parallel
    const [products, total] = await Promise.all([
      Product.find(filter)
        .populate('category', 'name slug')
        .populate('brand', 'name slug')
        .sort(sortOption)
        .skip(skip)
        .limit(limit),
      Product.countDocuments(filter),
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
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch products', error });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category', 'name slug')
      .populate('brand', 'name slug');

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch product', error });
  }
};