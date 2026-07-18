import { Request, Response } from 'express';
import Brand from '../models/Brand';

// Create a brand
export const createBrand = async (req: Request, res: Response) => {
  try {
    const brand = await Brand.create(req.body);
    res.status(201).json(brand);
  } catch (error) {
    res.status(400).json({ message: 'Failed to create brand', error });
  }
};

// Get all brands
export const getBrands = async (req: Request, res: Response) => {
  try {
    const brands = await Brand.find().sort({ name: 1 });
    res.status(200).json(brands);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch brands', error });
  }
};

// Get single brand by ID
export const getBrandById = async (req: Request, res: Response) => {
  try {
    const brand = await Brand.findById(req.params.id);
    if (!brand) {
      return res.status(404).json({ message: 'Brand not found' });
    }
    res.status(200).json(brand);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch brand', error });
  }
};

// Update brand
export const updateBrand = async (req: Request, res: Response) => {
  try {
    const brand = await Brand.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!brand) {
      return res.status(404).json({ message: 'Brand not found' });
    }
    res.status(200).json(brand);
  } catch (error) {
    res.status(400).json({ message: 'Failed to update brand', error });
  }
};

// Delete brand
export const deleteBrand = async (req: Request, res: Response) => {
  try {
    const brand = await Brand.findByIdAndDelete(req.params.id);
    if (!brand) {
      return res.status(404).json({ message: 'Brand not found' });
    }
    res.status(200).json({ message: 'Brand deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete brand', error });
  }
};