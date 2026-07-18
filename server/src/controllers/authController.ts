import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';

// Helper: generates a signed JWT containing the user's ID and role
const generateToken = (userId: string, role: string): string => {
  const secret = process.env.JWT_SECRET as string;
  return jwt.sign({ id: userId, role }, secret, { expiresIn: '7d' });
};

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role, phone } = req.body;

    // Check if a user with this email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const user = await User.create({
      name,
      email,
      password,
      phone,
      role: 'customer', // force customer for public signups
    });

    const token = generateToken(user._id.toString(), user.role);

    res.status(201).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    res.status(400).json({ message: 'Registration failed', error });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(user._id.toString(), user.role);

    res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error });
  }
};

// Admin: Get all customers
export const listCustomers = async (req: Request, res: Response) => {
  try {
    const customers = await User.find({ role: 'customer' }).select('-password').sort({ createdAt: -1 });
    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch customers', error });
  }
};

// Admin: Get all staff members
export const listStaff = async (req: Request, res: Response) => {
  try {
    const staff = await User.find({ role: { $ne: 'customer' } }).select('-password').sort({ createdAt: -1 });
    res.status(200).json(staff);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch staff list', error });
  }
};

// Admin: Create staff member
export const createStaff = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role, phone } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const staff = await User.create({
      name,
      email,
      password,
      role: role || 'staff',
      phone,
    });

    res.status(201).json({
      id: staff._id,
      name: staff.name,
      email: staff.email,
      role: staff.role,
      phone: staff.phone,
      isActive: staff.isActive,
    });
  } catch (error) {
    res.status(400).json({ message: 'Failed to create staff member', error });
  }
};

// Admin: Update user/staff details
export const updateUser = async (req: Request, res: Response) => {
  try {
    const { name, email, role, phone, isActive, password } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.name = name ?? user.name;
    user.email = email ?? user.email;
    user.role = role ?? user.role;
    user.phone = phone ?? user.phone;
    user.isActive = isActive ?? user.isActive;

    if (password) {
      user.password = password; // Trigger hashing middleware
    }

    await user.save();

    res.status(200).json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      isActive: user.isActive,
    });
  } catch (error) {
    res.status(400).json({ message: 'Failed to update user', error });
  }
};

// Admin: Delete user/staff
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete user', error });
  }
};