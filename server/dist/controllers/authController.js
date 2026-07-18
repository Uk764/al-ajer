"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.createStaff = exports.listStaff = exports.listCustomers = exports.login = exports.register = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
// Helper: generates a signed JWT containing the user's ID and role
const generateToken = (userId, role) => {
    const secret = process.env.JWT_SECRET;
    return jsonwebtoken_1.default.sign({ id: userId, role }, secret, { expiresIn: '7d' });
};
const register = async (req, res) => {
    try {
        const { name, email, password, role, phone } = req.body;
        // Check if a user with this email already exists
        const existingUser = await User_1.default.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already registered' });
        }
        const user = await User_1.default.create({
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
    }
    catch (error) {
        res.status(400).json({ message: 'Registration failed', error });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User_1.default.findOne({ email });
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
    }
    catch (error) {
        res.status(500).json({ message: 'Login failed', error });
    }
};
exports.login = login;
// Admin: Get all customers
const listCustomers = async (req, res) => {
    try {
        const customers = await User_1.default.find({ role: 'customer' }).select('-password').sort({ createdAt: -1 });
        res.status(200).json(customers);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to fetch customers', error });
    }
};
exports.listCustomers = listCustomers;
// Admin: Get all staff members
const listStaff = async (req, res) => {
    try {
        const staff = await User_1.default.find({ role: { $ne: 'customer' } }).select('-password').sort({ createdAt: -1 });
        res.status(200).json(staff);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to fetch staff list', error });
    }
};
exports.listStaff = listStaff;
// Admin: Create staff member
const createStaff = async (req, res) => {
    try {
        const { name, email, password, role, phone } = req.body;
        const existingUser = await User_1.default.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already registered' });
        }
        const staff = await User_1.default.create({
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
    }
    catch (error) {
        res.status(400).json({ message: 'Failed to create staff member', error });
    }
};
exports.createStaff = createStaff;
// Admin: Update user/staff details
const updateUser = async (req, res) => {
    try {
        const { name, email, role, phone, isActive, password } = req.body;
        const user = await User_1.default.findById(req.params.id);
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
    }
    catch (error) {
        res.status(400).json({ message: 'Failed to update user', error });
    }
};
exports.updateUser = updateUser;
// Admin: Delete user/staff
const deleteUser = async (req, res) => {
    try {
        const user = await User_1.default.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to delete user', error });
    }
};
exports.deleteUser = deleteUser;
