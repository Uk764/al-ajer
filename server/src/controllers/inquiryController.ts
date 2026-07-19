import { Request, Response } from 'express';
import Inquiry from '../models/Inquiry';

// Create a new inquiry (Public endpoint)
export const createInquiry = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !phone || !message) {
      return res.status(400).json({ message: 'Please provide all required fields.' });
    }

    const inquiry = await Inquiry.create({
      name,
      email,
      phone,
      subject: subject || null,
      message,
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
