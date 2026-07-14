import { Request, Response } from 'express';
import * as XLSX from 'xlsx';
import Product from '../models/Product';
import Category from '../models/Category';
import Brand from '../models/Brand';

interface ImportRow {
  name?: string;
  slug?: string;
  sku?: string;
  barcode?: string;
  category?: string; // category NAME from the spreadsheet, not an ID
  brand?: string;     // brand NAME from the spreadsheet, not an ID
  costPrice?: number;
  sellingPrice?: number;
  unit?: string;
  description?: string;
}

interface ImportResult {
  row: number;
  status: 'created' | 'updated' | 'failed';
  sku?: string;
  reason?: string;
}

export const bulkImportProducts = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Parse the uploaded file (Excel or CSV) directly from its in-memory buffer
    const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
    const firstSheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[firstSheetName];
    const rows: ImportRow[] = XLSX.utils.sheet_to_json(sheet);

    // Pre-load ALL categories and brands into memory ONCE, instead of
    // querying the database inside the loop for every single row —
    // critical for performance across thousands of rows.
    const categories = await Category.find();
    const brands = await Brand.find();

    // Build quick lookup maps: category/brand name -> its ObjectId
    const categoryMap = new Map(categories.map((c) => [c.name.toLowerCase(), c._id]));
    const brandMap = new Map(brands.map((b) => [b.name.toLowerCase(), b._id]));

    const results: ImportResult[] = [];

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

        const existingProduct = await Product.findOne({ sku: row.sku.toUpperCase() });

        if (existingProduct) {
          // Update the existing product's data
          existingProduct.name = row.name;
          existingProduct.slug = slug;
          existingProduct.category = categoryId;
          existingProduct.brand = brandId;
          existingProduct.costPrice = row.costPrice;
          existingProduct.sellingPrice = row.sellingPrice;
          existingProduct.unit = row.unit || existingProduct.unit;
          if (row.barcode) existingProduct.barcode = row.barcode;
          if (row.description) existingProduct.description = row.description;
          await existingProduct.save();

          results.push({ row: rowNumber, status: 'updated', sku: row.sku });
        } else {
          // Create a new product
          await Product.create({
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
      } catch (rowError: any) {
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
  } catch (error) {
    console.error('Bulk import error:', error);
    res.status(500).json({ message: 'Bulk import failed', error });
  }
};