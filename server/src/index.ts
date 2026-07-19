import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import categoryRoutes from './routes/categoryRoutes';
import brandRoutes from './routes/brandRoutes';
import productRoutes from './routes/productRoutes';
import branchRoutes from './routes/branchRoutes';
import inventoryRoutes from './routes/inventoryRoutes';
import authRoutes from './routes/authRoutes';
import uploadRoutes from './routes/uploadRoutes';
import { configureCloudinary } from './config/cloudinary';
import bulkImportRoutes from './routes/bulkImportRoutes';
import cartRoutes from './routes/cartRoutes';
import orderRoutes from './routes/orderRoutes';
import couponRoutes from './routes/couponRoutes';
import bannerRoutes from './routes/bannerRoutes';
import reportRoutes from './routes/reportRoutes';
import inquiryRoutes from './routes/inquiryRoutes';


// Load variables from our .env file into process.env
dotenv.config();

// Connect to MongoDB Atlas before anything else starts
connectDB();

configureCloudinary();

// Create the Express application — this is our whole backend "app"
const app = express();

// Allow our future frontend to call this API without being blocked by the browser
app.use(cors());

// Let Express automatically parse incoming JSON request bodies into JS objects
app.use(express.json());

app.use('/api/categories', categoryRoutes);
app.use('/api/brands', brandRoutes);
app.use('/api/products', productRoutes);
app.use('/api/branches', branchRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/bulk-import', bulkImportRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/banners', bannerRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/inquiries', inquiryRoutes);

// A simple "health check" route — visiting this confirms the server is alive
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'AL AJER API is running' });
});

// Which network port to listen on — read from .env, or default to 5000
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});