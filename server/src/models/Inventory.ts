import mongoose, { Schema, Document } from 'mongoose';

export interface IInventory extends Document {
  product: mongoose.Types.ObjectId;
  branch: mongoose.Types.ObjectId;
  quantity: number;
  reorderLevel: number;
  createdAt: Date;
  updatedAt: Date;
}

const inventorySchema = new Schema<IInventory>(
  {
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    branch: { type: Schema.Types.ObjectId, ref: 'Branch', required: true },
    quantity: { type: Number, required: true, default: 0, min: 0 },
    reorderLevel: { type: Number, required: true, default: 5, min: 0 },
  },
  { timestamps: true }
);

// Compound unique index: one product can only have ONE inventory record per branch
inventorySchema.index({ product: 1, branch: 1 }, { unique: true });

export default mongoose.model<IInventory>('Inventory', inventorySchema);