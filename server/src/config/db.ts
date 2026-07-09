import mongoose from 'mongoose';

// This function attempts to connect to MongoDB Atlas using the URI from .env
export const connectDB = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGODB_URI;

    // Fail fast and clearly if the .env value is missing — better than a confusing crash later
    if (!mongoUri) {
      throw new Error('MONGODB_URI is not defined in .env');
    }

    await mongoose.connect(mongoUri);

    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection failed:', error);
    // Stop the whole app if we can't connect to the database — 
    // there's no point running an API that can't reach its data
    process.exit(1);
  }
};