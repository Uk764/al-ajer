"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBranch = exports.updateBranch = exports.getBranchById = exports.getBranches = exports.createBranch = void 0;
const Branch_1 = __importDefault(require("../models/Branch"));
// Create a branch
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
// Get all branches
const getBranches = async (req, res) => {
    try {
        const branches = await Branch_1.default.find().sort({ name: 1 });
        res.status(200).json(branches);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to fetch branches', error });
    }
};
exports.getBranches = getBranches;
// Get single branch by ID
const getBranchById = async (req, res) => {
    try {
        const branch = await Branch_1.default.findById(req.params.id);
        if (!branch) {
            return res.status(404).json({ message: 'Branch not found' });
        }
        res.status(200).json(branch);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to fetch branch', error });
    }
};
exports.getBranchById = getBranchById;
// Update branch
const updateBranch = async (req, res) => {
    try {
        const branch = await Branch_1.default.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!branch) {
            return res.status(404).json({ message: 'Branch not found' });
        }
        res.status(200).json(branch);
    }
    catch (error) {
        res.status(400).json({ message: 'Failed to update branch', error });
    }
};
exports.updateBranch = updateBranch;
// Delete branch
const deleteBranch = async (req, res) => {
    try {
        const branch = await Branch_1.default.findByIdAndDelete(req.params.id);
        if (!branch) {
            return res.status(404).json({ message: 'Branch not found' });
        }
        res.status(200).json({ message: 'Branch deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to delete branch', error });
    }
};
exports.deleteBranch = deleteBranch;
