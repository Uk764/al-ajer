"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadSpreadsheet = exports.uploadImage = void 0;
const multer_1 = __importDefault(require("multer"));
const storage = multer_1.default.memoryStorage();
// For product image uploads — only allows image files
exports.uploadImage = (0, multer_1.default)({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        }
        else {
            cb(new Error('Only JPEG, PNG, and WEBP images are allowed'));
        }
    },
});
// For bulk import — only allows spreadsheet files (CSV or Excel)
exports.uploadSpreadsheet = (0, multer_1.default)({
    storage,
    limits: { fileSize: 20 * 1024 * 1024 }, // 20MB max — bigger, since 15,000 rows is a large file
    fileFilter: (req, file, cb) => {
        const allowedTypes = [
            'text/csv',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
        ];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        }
        else {
            cb(new Error('Only CSV and Excel files are allowed'));
        }
    },
});
