import { v2 as cloudinary } from 'cloudinary';

// Wrapped in a function so it only runs when we explicitly call it —
// NOT immediately when this file is imported (imports resolve before
// dotenv.config() runs, so process.env values wouldn't be ready yet).
export const configureCloudinary = (): void => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
};

export default cloudinary;