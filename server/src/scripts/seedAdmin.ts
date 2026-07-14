import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User';

dotenv.config();

const seedAdmin = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI as string;
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB for seeding...');

    const existingAdmin = await User.findOne({ email: 'admin@alajer.com' });
    if (existingAdmin) {
      console.log('Admin already exists. Aborting.');
      process.exit(0);
    }

    const admin = await User.create({
      name: 'AL AJER Admin',
      email: 'admin@alajer.com',
      password: 'alajer@123',
      role: 'admin',
      phone: '0558830854',
    });

    console.log('Admin created successfully:', admin.email);
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedAdmin();