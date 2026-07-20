"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = require("./config/db");
const categoryRoutes_1 = __importDefault(require("./routes/categoryRoutes"));
const brandRoutes_1 = __importDefault(require("./routes/brandRoutes"));
const productRoutes_1 = __importDefault(require("./routes/productRoutes"));
const branchRoutes_1 = __importDefault(require("./routes/branchRoutes"));
const inventoryRoutes_1 = __importDefault(require("./routes/inventoryRoutes"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const uploadRoutes_1 = __importDefault(require("./routes/uploadRoutes"));
const cloudinary_1 = require("./config/cloudinary");
const bulkImportRoutes_1 = __importDefault(require("./routes/bulkImportRoutes"));
const cartRoutes_1 = __importDefault(require("./routes/cartRoutes"));
const orderRoutes_1 = __importDefault(require("./routes/orderRoutes"));
const couponRoutes_1 = __importDefault(require("./routes/couponRoutes"));
const bannerRoutes_1 = __importDefault(require("./routes/bannerRoutes"));
const reportRoutes_1 = __importDefault(require("./routes/reportRoutes"));
const inquiryRoutes_1 = __importDefault(require("./routes/inquiryRoutes"));
// Load variables from our .env file into process.env
dotenv_1.default.config();
// Connect to MongoDB Atlas before anything else starts
(0, db_1.connectDB)();
(0, cloudinary_1.configureCloudinary)();
// Create the Express application — this is our whole backend "app"
const app = (0, express_1.default)();
// Allow our future frontend to call this API without being blocked by the browser
app.use((0, cors_1.default)());
// Let Express automatically parse incoming JSON request bodies into JS objects
app.use(express_1.default.json());
app.use('/api/categories', categoryRoutes_1.default);
app.use('/api/brands', brandRoutes_1.default);
app.use('/api/products', productRoutes_1.default);
app.use('/api/branches', branchRoutes_1.default);
app.use('/api/inventory', inventoryRoutes_1.default);
app.use('/api/auth', authRoutes_1.default);
app.use('/api/upload', uploadRoutes_1.default);
app.use('/api/bulk-import', bulkImportRoutes_1.default);
app.use('/api/cart', cartRoutes_1.default);
app.use('/api/orders', orderRoutes_1.default);
app.use('/api/coupons', couponRoutes_1.default);
app.use('/api/banners', bannerRoutes_1.default);
app.use('/api/reports', reportRoutes_1.default);
app.use('/api/inquiries', inquiryRoutes_1.default);
// A simple "health check" route — visiting this confirms the server is alive
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'AL AJER API is running' });
});
// Which network port to listen on — read from .env, or default to 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
