import { Request, Response } from 'express';
import Brand from '../models/Brand';

export const createBrand = async (req: Request, res: Response) => {
  try {
    const brand = await Brand.create(req.body);
    res.status(201).json(brand);
  } catch (error) {
    res.status(400).json({ message: 'Failed to create brand', error });
  }
};

export const getBrands = async (req: Request, res: Response) => {
  try {
    const brands = await Brand.find();
    res.status(200).json(brands);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch brands', error });
  }
};