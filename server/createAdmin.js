// createAdmin.js - Run this once to create admin user
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const createAdmin = async () => {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@gym.com' });
    if (existingAdmin) {
      console.log('\n⚠️  Admin user already exists!');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('📧 Email: admin@gym.com');
      console.log('🔑 Password: admin123');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('\n✨ You can login with these credentials!');
      process.exit(0);
    }

    // Hash password
    console.log('🔄 Creating admin user...');
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    // Create admin user
    const admin = new User({
      name: 'Admin',
      email: 'admin@gym.com',
      password: hashedPassword,
      role: 'admin',
    });

    await admin.save();
    
    console.log('\n✅ Admin user created successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Email: admin@gym.com');
    console.log('🔑 Password: admin123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n🎉 You can now login with these credentials!');
    console.log('🚀 Start the server with: npm start\n');
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.log('\n💡 Make sure:');
    console.log('   1. MongoDB is running');
    console.log('   2. MONGO_URI in .env is correct');
    console.log('   3. You have network access to MongoDB\n');
    process.exit(1);
  }
};

createAdmin();