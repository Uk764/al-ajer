import { Request, Response } from 'express';
import Inventory from '../models/Inventory';

// Create or update stock for a product at a branch
export const upsertInventory = async (req: Request, res: Response) => {
  try {
    const { product, branch, quantity, reorderLevel } = req.body;

    // "Upsert" = update if it exists, insert (create) if it doesn't
    const inventory = await Inventory.findOneAndUpdate(
      { product, branch },
      { quantity, reorderLevel },
      { new: true, upsert: true, runValidators: true }
    );

    res.status(200).json(inventory);
  } catch (error) {
    res.status(400).json({ message: 'Failed to update inventory', error });
  }
};

// Get inventory for a specific product, across all branches
export const getInventoryByProduct = async (req: Request, res: Response) => {
  try {
    const inventory = await Inventory.find({ product: req.params.productId })
      .populate('branch', 'name code');

    res.status(200).json(inventory);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch inventory', error });
  }
};