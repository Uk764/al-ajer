import mongoose, { Schema, Document } from 'mongoose';

export interface IInquiry extends Document {
  name: string;
  email: string;
  phone: string;
  subject: string | null;
  message: string;
  status: 'pending' | 'resolved';
  user: mongoose.Types.ObjectId | null;
  product: mongoose.Types.ObjectId | null;
  adminResponse: string | null;
  createdAt: Date;
  updatedAt: Date;
}

const inquirySchema = new Schema<IInquiry>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    subject: { type: String, default: null, trim: true },
    message: { type: String, required: true, trim: true },
    status: { type: String, enum: ['pending', 'resolved'], default: 'pending' },
    user: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    product: { type: Schema.Types.ObjectId, ref: 'Product', default: null },
    adminResponse: { type: String, default: null },
  },
  { timestamps: true }
);

export default mongoose.model<IInquiry>('Inquiry', inquirySchema);
