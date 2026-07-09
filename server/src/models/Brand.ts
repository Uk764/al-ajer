import mongoose, { Schema, Document } from 'mongoose';

export interface IBrand extends Document {
  name: string;
  slug: string;
  logoUrl: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const brandSchema = new Schema<IBrand>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    logoUrl: { type: String, default: null },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model<IBrand>('Brand', brandSchema);