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

// Get all inventory records across all products and branches
export const getAllInventory = async (req: Request, res: Response) => {
  try {
    const inventory = await Inventory.find()
      .populate('product', 'name sku sellingPrice unit')
      .populate('branch', 'name code');
    res.status(200).json(inventory);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch all inventory', error });
  }
};

// Delete inventory record
export const deleteInventory = async (req: Request, res: Response) => {
  try {
    const inventory = await Inventory.findByIdAndDelete(req.params.id);
    if (!inventory) {
      return res.status(404).json({ message: 'Inventory record not found' });
    }
    res.status(200).json({ message: 'Inventory record deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete inventory record', error });
  }
};