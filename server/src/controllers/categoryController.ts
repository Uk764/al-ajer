import { Request, Response } from 'express';
import Category from '../models/Category';

// Create a new category
export const createCategory = async (req: Request, res: Response) => {
  try {
    const category = await Category.create(req.body);
    res.status(201).json(category);
  } catch (error) {
    res.status(400).json({ message: 'Failed to create category', error });
  }
};

// Get all categories
export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch categories', error });
  }
};