"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteInquiry = exports.updateInquiryStatus = exports.updateInquiry = exports.getMyInquiries = exports.getInquiries = exports.createInquiry = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Inquiry_1 = __importDefault(require("../models/Inquiry"));
const User_1 = __importDefault(require("../models/User"));
// Create a new inquiry (Public/Authenticated endpoint)
const createInquiry = async (req, res) => {
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
                const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
                associatedUserId = decoded.id;
            }
            catch (err) {
                // Ignore invalid token, treat as guest
            }
        }
        const inquiry = await Inquiry_1.default.create({
            name,
            email,
            phone,
            subject: subject || null,
            message,
            product: product || null,
            user: associatedUserId,
        });
        res.status(201).json(inquiry);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to submit inquiry', error: error.message || error });
    }
};
exports.createInquiry = createInquiry;
// Get inquiries list (Admin protected, paginated, filterable)
const getInquiries = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;
        const filter = {};
        if (req.query.status) {
            filter.status = req.query.status;
        }
        if (req.query.search) {
            const searchRegex = new RegExp(req.query.search, 'i');
            filter.$or = [
                { name: searchRegex },
                { email: searchRegex },
                { phone: searchRegex },
                { subject: searchRegex },
                { message: searchRegex },
            ];
        }
        const [inquiries, total] = await Promise.all([
            Inquiry_1.default.find(filter)
                .populate('user', 'name email role')
                .populate('product', 'name sku thumbnailUrl slug')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            Inquiry_1.default.countDocuments(filter),
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
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to fetch inquiries', error: error.message || error });
    }
};
exports.getInquiries = getInquiries;
// Get inquiries for logged-in customer
const getMyInquiries = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Not authorized.' });
        }
        const userId = req.user.id;
        const userDoc = await User_1.default.findById(userId);
        const userEmail = userDoc ? userDoc.email : '';
        const filter = {
            $or: [{ user: userId }],
        };
        if (userEmail) {
            filter.$or.push({ email: userEmail });
        }
        const inquiries = await Inquiry_1.default.find(filter)
            .populate('product', 'name sku thumbnailUrl slug')
            .sort({ createdAt: -1 });
        res.status(200).json(inquiries);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to fetch inquiries', error: error.message || error });
    }
};
exports.getMyInquiries = getMyInquiries;
// Update entire inquiry (Admin full CRUD)
const updateInquiry = async (req, res) => {
    try {
        const inquiry = await Inquiry_1.default.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        })
            .populate('user', 'name email role')
            .populate('product', 'name sku thumbnailUrl slug');
        if (!inquiry) {
            return res.status(404).json({ message: 'Inquiry not found.' });
        }
        res.status(200).json(inquiry);
    }
    catch (error) {
        res.status(400).json({ message: 'Failed to update inquiry', error: error.message || error });
    }
};
exports.updateInquiry = updateInquiry;
// Update inquiry status (Admin/Staff protected)
const updateInquiryStatus = async (req, res) => {
    try {
        const { status } = req.body;
        if (!status || !['pending', 'resolved'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status value.' });
        }
        const inquiry = await Inquiry_1.default.findByIdAndUpdate(req.params.id, { status }, { new: true, runValidators: true });
        if (!inquiry) {
            return res.status(404).json({ message: 'Inquiry not found.' });
        }
        res.status(200).json(inquiry);
    }
    catch (error) {
        res.status(400).json({ message: 'Failed to update inquiry status', error: error.message || error });
    }
};
exports.updateInquiryStatus = updateInquiryStatus;
// Delete inquiry (Admin/Manager protected)
const deleteInquiry = async (req, res) => {
    try {
        const inquiry = await Inquiry_1.default.findByIdAndDelete(req.params.id);
        if (!inquiry) {
            return res.status(404).json({ message: 'Inquiry not found.' });
        }
        res.status(200).json({ message: 'Inquiry deleted successfully.' });
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to delete inquiry', error: error.message || error });
    }
};
exports.deleteInquiry = deleteInquiry;
