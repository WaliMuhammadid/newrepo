import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { MongoClient } from 'mongodb';

const router = express.Router();

// MongoDB Connection
const client = new MongoClient(process.env.MONGODB_URI);
let db;

async function connectDB() {
  if (!db) {
    await client.connect();
    db = client.db('mumtaz-store');
  }
  return db;
}

// Middleware
router.use(cors());
router.use(express.json());

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }
    
    const db = await connectDB();
    
    // Find admin user
    let admin = await db.collection('admins').findOne({ email });
    
    // If no admin exists, create one (for demo)
    if (!admin) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      admin = {
        _id: new Date().getTime().toString(),
        email: 'admin@mumtazstore.com',
        password: hashedPassword,
        name: 'Admin',
        createdAt: new Date()
      };
      await db.collection('admins').insertOne(admin);
    }
    
    // Verify password
    const isValidPassword = await bcrypt.compare(password, admin.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { id: admin._id, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.json({
      success: true,
      token,
      user: {
        id: admin._id,
        email: admin.email,
        name: admin.name
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }
    
    const db = await connectDB();
    
    // Check if admin already exists
    const existingAdmin = await db.collection('admins').findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin already exists' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create admin
    const admin = {
      _id: new Date().getTime().toString(),
      email,
      password: hashedPassword,
      name: name || 'Admin',
      createdAt: new Date()
    };
    
    await db.collection('admins').insertOne(admin);
    
    // Generate JWT token
    const token = jwt.sign(
      { id: admin._id, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.status(201).json({
      success: true,
      token,
      user: {
        id: admin._id,
        email: admin.email,
        name: admin.name
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/auth/me
router.get('/me', async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'Access token required' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const db = await connectDB();
    
    const admin = await db.collection('admins').findOne(
      { _id: decoded.id },
      { projection: { password: 0 } }
    );
    
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    
    res.json({ success: true, user: admin });
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

export default router;
