import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import Admin from '../models/Admin.js';

dotenv.config();

/**
 * Seed an initial admin user into the database
 * Run this script to create the first admin account
 * 
 * Usage: node utils/seedAdmin.js
 */
const seedAdmin = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      console.error('ERROR: MONGODB_URI is not defined');
      process.exit(1);
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@mumtazstore.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log(`Admin already exists: ${adminEmail}`);
      console.log('To reset password, delete the admin document from MongoDB and run again.');
      process.exit(0);
    }

    // Create admin
    const admin = await Admin.create({
      email: adminEmail,
      password: adminPassword,
      name: 'Admin',
    });

    console.log('Admin created successfully!');
    console.log(`Email: ${adminEmail}`);
    console.log(`Password: ${adminPassword}`);
    console.log('Make sure to change the password in production!');
  } catch (error) {
    console.error('Error seeding admin:', error.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

seedAdmin();
