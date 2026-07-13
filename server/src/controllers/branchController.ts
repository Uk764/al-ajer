import { Request, Response } from 'express';
import Branch from '../models/Branch';

export const createBranch = async (req: Request, res: Response) => {
  try {
    const branch = await Branch.create(req.body);
    res.status(201).json(branch);
  } catch (error) {
    res.status(400).json({ message: 'Failed to create branch', error });
  }
};

export const getBranches = async (req: Request, res: Response) => {
  try {
    const branches = await Branch.find();
    res.status(200).json(branches);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch branches', error });
  }
};