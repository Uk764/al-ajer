"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const User_1 = __importDefault(require("../models/User"));
dotenv_1.default.config();
const seedAdmin = async () => {
    try {
        const mongoUri = process.env.MONGODB_URI;
        await mongoose_1.default.connect(mongoUri);
        console.log('Connected to MongoDB for seeding...');
        const existingAdmin = await User_1.default.findOne({ email: 'admin@alajer.com' });
        if (existingAdmin) {
            console.log('Admin already exists. Aborting.');
            process.exit(0);
        }
        const admin = await User_1.default.create({
            name: 'AL AJER Admin',
            email: 'admin@alajer.com',
            password: 'alajer@123',
            role: 'admin',
            phone: '0558830854',
        });
        console.log('Admin created successfully:', admin.email);
        process.exit(0);
    }
    catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
};
seedAdmin();
