"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
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
        // Note: we intentionally do NOT let the request body set 'role' to 'admin'
        // for public registration — that's a security decision, explained below.
        const user = await User_1.default.create({
            name,
            email,
            password,
            phone,
            role: role === 'customer' ? 'customer' : 'customer', // force customer for public signups
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
