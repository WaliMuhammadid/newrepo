import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
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
router.use(express.json({ limit: '10mb' }));

// JWT Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
};

// GET /api/products
router.get('/', async (req, res) => {
  try {
    const db = await connectDB();
    const { category, search } = req.query;
    
    let query = {};
    if (category && category !== 'All') {
      query.category = category;
    }
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }
    
    const products = await db.collection('products').find(query).toArray();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/products/:id
router.get('/:id', async (req, res) => {
  try {
    const db = await connectDB();
    const product = await db.collection('products').findOne({ _id: req.params.id });
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/products (Protected)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const db = await connectDB();
    const product = {
      ...req.body,
      _id: new Date().getTime().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    await db.collection('products').insertOne(product);
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/products/:id (Protected)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const db = await connectDB();
    const updateData = {
      ...req.body,
      updatedAt: new Date()
    };
    
    const result = await db.collection('products').updateOne(
      { _id: req.params.id },
      { $set: updateData }
    );
    
    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json({ ...updateData, _id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE /api/products/:id (Protected)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const db = await connectDB();
    const result = await db.collection('products').deleteOne({ _id: req.params.id });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
