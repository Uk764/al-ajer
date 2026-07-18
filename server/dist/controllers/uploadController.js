"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadImage = void 0;
const cloudinary_1 = __importDefault(require("../config/cloudinary"));
const uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }
        // Convert the in-memory file buffer into a format Cloudinary's upload API accepts:
        // a "data URI" — a text representation of binary data, prefixed with its type.
        const base64 = req.file.buffer.toString('base64');
        const dataUri = `data:${req.file.mimetype};base64,${base64}`;
        const result = await cloudinary_1.default.uploader.upload(dataUri, {
            folder: 'al-ajer/products', // organizes uploads into a folder inside your Cloudinary account
        });
        res.status(200).json({
            url: result.secure_url,
            publicId: result.public_id,
        });
    }
    catch (error) {
        console.error('Upload error details:', error);
        res.status(500).json({ message: 'Image upload failed', error });
    }
};
exports.uploadImage = uploadImage;
