import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcrypt';

export type UserRole = 'admin' | 'manager' | 'cashier' | 'staff' | 'customer';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  phone: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    role: {
      type: String,
      enum: ['admin', 'manager', 'cashier', 'staff', 'customer'],
      default: 'customer',
    },
    phone: { type: String, default: null },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Runs automatically right before a User document is saved
userSchema.pre('save', async function () {
  // Only re-hash the password if it's new or was actually changed
  // (prevents re-hashing an already-hashed password on unrelated updates, e.g. changing just the phone number)
  if (!this.isModified('password')) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// An instance method we can call on any fetched user: user.comparePassword('typedPassword')
userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model<IUser>('User', userSchema);