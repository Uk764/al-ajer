import mongoose, { Schema, Document } from 'mongoose';

// A single specification entry, e.g. { key: "Voltage", value: "18V" }
interface ISpecification {
  key: string;
  value: string;
}

export interface IProduct extends Document {
  name: string;
  slug: string;
  description: string;
  sku: string;
  barcode: string;
  category: mongoose.Types.ObjectId;
  brand: mongoose.Types.ObjectId;
  costPrice: number;
  sellingPrice: number;
  discountedPrice: number | null;
  specifications: ISpecification[];
  images: string[];
  thumbnailUrl: string | null;
  unit: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const specificationSchema = new Schema<ISpecification>(
  {
    key: { type: String, required: true },
    value: { type: String, required: true },
  },
  { _id: false } // don't give each spec its own separate ID — unnecessary here
);

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, default: '' },
    sku: { type: String, required: true, unique: true, uppercase: true },
    barcode: { type: String, required: true, unique: true },

    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    brand: { type: Schema.Types.ObjectId, ref: 'Brand', required: true },

    costPrice: { type: Number, required: true, min: 0 },
    sellingPrice: { type: Number, required: true, min: 0 },
    discountedPrice: { type: Number, default: null, min: 0 },

    specifications: { type: [specificationSchema], default: [] },
    images: { type: [String], default: [] },
    thumbnailUrl: { type: String, default: null },

    unit: { type: String, required: true, default: 'piece' },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Indexes for fast search, filter, and sort at 15,000+ product scale
productSchema.index({ name: 'text', description: 'text' }); // enables text search
productSchema.index({ category: 1 });
productSchema.index({ brand: 1 });
productSchema.index({ sellingPrice: 1 });
productSchema.index({ sku: 1 });

export default mongoose.model<IProduct>('Product', productSchema);