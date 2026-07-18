import { Request, Response } from 'express';
import Branch from '../models/Branch';

// Create a branch
export const createBranch = async (req: Request, res: Response) => {
  try {
    const branch = await Branch.create(req.body);
    res.status(201).json(branch);
  } catch (error) {
    res.status(400).json({ message: 'Failed to create branch', error });
  }
};

// Get all branches
export const getBranches = async (req: Request, res: Response) => {
  try {
    const branches = await Branch.find().sort({ name: 1 });
    res.status(200).json(branches);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch branches', error });
  }
};

// Get single branch by ID
export const getBranchById = async (req: Request, res: Response) => {
  try {
    const branch = await Branch.findById(req.params.id);
    if (!branch) {
      return res.status(404).json({ message: 'Branch not found' });
    }
    res.status(200).json(branch);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch branch', error });
  }
};

// Update branch
export const updateBranch = async (req: Request, res: Response) => {
  try {
    const branch = await Branch.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!branch) {
      return res.status(404).json({ message: 'Branch not found' });
    }
    res.status(200).json(branch);
  } catch (error) {
    res.status(400).json({ message: 'Failed to update branch', error });
  }
};

// Delete branch
export const deleteBranch = async (req: Request, res: Response) => {
  try {
    const branch = await Branch.findByIdAndDelete(req.params.id);
    if (!branch) {
      return res.status(404).json({ message: 'Branch not found' });
    }
    res.status(200).json({ message: 'Branch deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete branch', error });
  }
};