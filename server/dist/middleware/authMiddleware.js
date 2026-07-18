"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Verifies the JWT token sent by the client. Blocks the request if missing/invalid.
const protect = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Not authorized, no token provided' });
    }
    const token = authHeader.split(' ')[1];
    try {
        const secret = process.env.JWT_SECRET;
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        req.user = { id: decoded.id, role: decoded.role };
        next();
    }
    catch (error) {
        return res.status(401).json({ message: 'Not authorized, invalid token' });
    }
};
exports.protect = protect;
// Restricts access to specific roles. Use AFTER `protect`.
const authorize = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Forbidden: insufficient permissions' });
        }
        next();
    };
};
exports.authorize = authorize;
