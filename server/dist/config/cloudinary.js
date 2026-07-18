"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configureCloudinary = void 0;
const cloudinary_1 = require("cloudinary");
// Wrapped in a function so it only runs when we explicitly call it —
// NOT immediately when this file is imported (imports resolve before
// dotenv.config() runs, so process.env values wouldn't be ready yet).
const configureCloudinary = () => {
    cloudinary_1.v2.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    });
};
exports.configureCloudinary = configureCloudinary;
exports.default = cloudinary_1.v2;
