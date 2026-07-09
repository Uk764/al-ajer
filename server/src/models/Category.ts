import mongoose, { Schema, Document } from 'mongoose';

// This interface describes the TypeScript "shape" of a Category document,
// so our code gets autocomplete + type-checking when working with categories
export interface ICategory extends Document {
  name: string;
  slug: string;
  parent: mongoose.Types.ObjectId | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const categorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    parent: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // automatically adds createdAt and updatedAt fields
  }
);

export default mongoose.model<ICategory>('Category', categorySchema);