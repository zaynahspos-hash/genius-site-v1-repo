import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/userModel.js';
import connectDB from '../config/db.js';

// Load environment variables
dotenv.config();

const importData = async () => {
  try {
    // Connect to Database
    await connectDB();

    console.log('🧹 Clearing existing users...');
    await User.deleteMany();

    console.log('👤 Creating Admin User...');
    const adminUser = {
      name: 'Super Admin',
      email: 'totvoguepk@gmail.com',
      password: 'my112233', // Will be hashed automatically by the model
      role: 'admin',
      addresses: [],
      wishlist: []
    };

    await User.create(adminUser);

    console.log('✅ Admin User Imported Successfully!');
    console.log(`📧 Email: ${adminUser.email}`);
    console.log(`🔑 Password: ${adminUser.password}`);
    
    process.exit();
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
};

importData();