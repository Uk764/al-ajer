"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bulkImportProducts = void 0;
const XLSX = __importStar(require("xlsx"));
const Product_1 = __importDefault(require("../models/Product"));
const Category_1 = __importDefault(require("../models/Category"));
const Brand_1 = __importDefault(require("../models/Brand"));
const bulkImportProducts = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }
        // Parse the uploaded file (Excel or CSV) directly from its in-memory buffer
        const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
        const firstSheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[firstSheetName];
        const rows = XLSX.utils.sheet_to_json(sheet);
        // Pre-load ALL categories and brands into memory ONCE, instead of
        // querying the database inside the loop for every single row —
        // critical for performance across thousands of rows.
        const categories = await Category_1.default.find();
        const brands = await Brand_1.default.find();
        // Build quick lookup maps: category/brand name -> its ObjectId
        const categoryMap = new Map(categories.map((c) => [c.name.toLowerCase(), c._id]));
        const brandMap = new Map(brands.map((b) => [b.name.toLowerCase(), b._id]));
        const results = [];
        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            const rowNumber = i + 2; // +2 because row 1 is the header, and spreadsheets are 1-indexed
            try {
                // Validate required fields are present
                if (!row.name || !row.sku || !row.category || !row.brand || !row.costPrice || !row.sellingPrice) {
                    results.push({ row: rowNumber, status: 'failed', reason: 'Missing required field(s)' });
                    continue; // skip this row, move to the next one — doesn't stop the whole import
                }
                const categoryId = categoryMap.get(row.category.toLowerCase());
                const brandId = brandMap.get(row.brand.toLowerCase());
                if (!categoryId) {
                    results.push({ row: rowNumber, status: 'failed', sku: row.sku, reason: `Category "${row.category}" not found` });
                    continue;
                }
                if (!brandId) {
                    results.push({ row: rowNumber, status: 'failed', sku: row.sku, reason: `Brand "${row.brand}" not found` });
                    continue;
                }
                const slug = row.slug || row.name.toLowerCase().replace(/\s+/g, '-');
                const existingProduct = await Product_1.default.findOne({ sku: row.sku.toUpperCase() });
                if (existingProduct) {
                    // Update the existing product's data
                    existingProduct.name = row.name;
                    existingProduct.slug = slug;
                    existingProduct.category = categoryId;
                    existingProduct.brand = brandId;
                    existingProduct.costPrice = row.costPrice;
                    existingProduct.sellingPrice = row.sellingPrice;
                    existingProduct.unit = row.unit || existingProduct.unit;
                    if (row.barcode)
                        existingProduct.barcode = row.barcode;
                    if (row.description)
                        existingProduct.description = row.description;
                    await existingProduct.save();
                    results.push({ row: rowNumber, status: 'updated', sku: row.sku });
                }
                else {
                    // Create a new product
                    await Product_1.default.create({
                        name: row.name,
                        slug,
                        sku: row.sku,
                        barcode: row.barcode || `NOBARCODE-${row.sku}`,
                        category: categoryId,
                        brand: brandId,
                        costPrice: row.costPrice,
                        sellingPrice: row.sellingPrice,
                        unit: row.unit || 'piece',
                        description: row.description || '',
                    });
                    results.push({ row: rowNumber, status: 'created', sku: row.sku });
                }
            }
            catch (rowError) {
                results.push({ row: rowNumber, status: 'failed', sku: row.sku, reason: rowError.message || 'Unknown error' });
            }
        }
        const summary = {
            totalRows: rows.length,
            created: results.filter((r) => r.status === 'created').length,
            updated: results.filter((r) => r.status === 'updated').length,
            failed: results.filter((r) => r.status === 'failed').length,
        };
        res.status(200).json({ summary, results });
    }
    catch (error) {
        console.error('Bulk import error:', error);
        res.status(500).json({ message: 'Bulk import failed', error });
    }
};
exports.bulkImportProducts = bulkImportProducts;
