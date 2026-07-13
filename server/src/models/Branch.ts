import mongoose, { Schema, Document } from 'mongoose';

export interface IBranch extends Document {
  name: string;
  code: string;
  address: string;
  city: string;
  phone: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const branchSchema = new Schema<IBranch>(
  {
    name: { type: String, required: true, trim: true },
    code: { type: String, required: true, unique: true, uppercase: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    phone: { type: String, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model<IBranch>('Branch', branchSchema);