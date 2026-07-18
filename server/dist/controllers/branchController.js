"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBranches = exports.createBranch = void 0;
const Branch_1 = __importDefault(require("../models/Branch"));
const createBranch = async (req, res) => {
    try {
        const branch = await Branch_1.default.create(req.body);
        res.status(201).json(branch);
    }
    catch (error) {
        res.status(400).json({ message: 'Failed to create branch', error });
    }
};
exports.createBranch = createBranch;
const getBranches = async (req, res) => {
    try {
        const branches = await Branch_1.default.find();
        res.status(200).json(branches);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to fetch branches', error });
    }
};
exports.getBranches = getBranches;
