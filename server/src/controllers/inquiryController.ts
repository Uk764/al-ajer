import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import Inquiry from '../models/Inquiry';
import User from '../models/User';
import { AuthRequest } from '../middleware/authMiddleware';

// Create a new inquiry (Public/Authenticated endpoint)
export const createInquiry = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, subject, message, product, user } = req.body;

    if (!name || !email || !phone || !message) {
      return res.status(400).json({ message: 'Please provide all required fields.' });
    }

    // Check if customer is authenticated to automatically link their user account
    let associatedUserId = user || null;
    const authHeader = req.headers.authorization;
    if (!associatedUserId && authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };
        associatedUserId = decoded.id;
      } catch (err) {
        // Ignore invalid token, treat as guest
      }
    }

    const inquiry = await Inquiry.create({
      name,
      email,
      phone,
      subject: subject || null,
      message,
      product: product || null,
      user: associatedUserId,
    });

    res.status(201).json(inquiry);
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to submit inquiry', error: error.message || error });
  }
};

// Get inquiries list (Admin protected, paginated, filterable)
export const getInquiries = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const filter: Record<string, any> = {};

    if (req.query.status) {
      filter.status = req.query.status;
    }

    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search as string, 'i');
      filter.$or = [
        { name: searchRegex },
        { email: searchRegex },
        { phone: searchRegex },
        { subject: searchRegex },
        { message: searchRegex },
      ];
    }

    const [inquiries, total] = await Promise.all([
      Inquiry.find(filter)
        .populate('user', 'name email role')
        .populate('product', 'name sku thumbnailUrl slug')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Inquiry.countDocuments(filter),
    ]);

    res.status(200).json({
      inquiries,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to fetch inquiries', error: error.message || error });
  }
};

// Get inquiries for logged-in customer
export const getMyInquiries = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized.' });
    }

    const userId = req.user.id;
    const userDoc = await User.findById(userId);
    const userEmail = userDoc ? userDoc.email : '';

    const filter: Record<string, any> = {
      $or: [{ user: userId }],
    };

    if (userEmail) {
      filter.$or.push({ email: userEmail });
    }

    const inquiries = await Inquiry.find(filter)
      .populate('product', 'name sku thumbnailUrl slug')
      .sort({ createdAt: -1 });

    res.status(200).json(inquiries);
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to fetch inquiries', error: error.message || error });
  }
};

// Update entire inquiry (Admin full CRUD)
export const updateInquiry = async (req: Request, res: Response) => {
  try {
    const inquiry = await Inquiry.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate('user', 'name email role')
      .populate('product', 'name sku thumbnailUrl slug');

    if (!inquiry) {
      return res.status(404).json({ message: 'Inquiry not found.' });
    }

    res.status(200).json(inquiry);
  } catch (error: any) {
    res.status(400).json({ message: 'Failed to update inquiry', error: error.message || error });
  }
};

// Update inquiry status (Admin/Staff protected)
export const updateInquiryStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;

    if (!status || !['pending', 'resolved'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value.' });
    }

    const inquiry = await Inquiry.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!inquiry) {
      return res.status(404).json({ message: 'Inquiry not found.' });
    }

    res.status(200).json(inquiry);
  } catch (error: any) {
    res.status(400).json({ message: 'Failed to update inquiry status', error: error.message || error });
  }
};

// Delete inquiry (Admin/Manager protected)
export const deleteInquiry = async (req: Request, res: Response) => {
  try {
    const inquiry = await Inquiry.findByIdAndDelete(req.params.id);

    if (!inquiry) {
      return res.status(404).json({ message: 'Inquiry not found.' });
    }

    res.status(200).json({ message: 'Inquiry deleted successfully.' });
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to delete inquiry', error: error.message || error });
  }
};
