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
router.use(express.json());

// JWT Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    // For guest users, create a session ID
    req.sessionId = req.headers['x-session-id'] || 'guest-' + Date.now();
    return next();
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      // If token is invalid, treat as guest
      req.sessionId = req.headers['x-session-id'] || 'guest-' + Date.now();
      return next();
    }
    req.user = user;
    next();
  });
};

// GET /api/cart
router.get('/', authenticateToken, async (req, res) => {
  try {
    const db = await connectDB();
    const userId = req.user?.id || req.sessionId;
    
    let cart = await db.collection('carts').findOne({ userId });
    
    if (!cart) {
      cart = { userId, items: [], createdAt: new Date() };
      await db.collection('carts').insertOne(cart);
    }
    
    res.json(cart.items || []);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/cart/add
router.post('/add', authenticateToken, async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const userId = req.user?.id || req.sessionId;
    
    if (!productId) {
      return res.status(400).json({ message: 'Product ID required' });
    }
    
    const db = await connectDB();
    
    // Check if product exists
    const product = await db.collection('products').findOne({ _id: productId });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Get or create cart
    let cart = await db.collection('carts').findOne({ userId });
    if (!cart) {
      cart = { userId, items: [], createdAt: new Date() };
    }
    
    // Check if item already exists
    const existingItemIndex = cart.items.findIndex(item => item.productId === productId);
    
    if (existingItemIndex >= 0) {
      // Update quantity
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Add new item
      cart.items.push({
        productId,
        name: product.name,
        price: product.price,
        imageURL: product.imageURL,
        quantity,
        addedAt: new Date()
      });
    }
    
    // Update cart
    await db.collection('carts').updateOne(
      { userId },
      { 
        $set: { 
          items: cart.items,
          updatedAt: new Date()
        } },
      { upsert: true }
    );
    
    res.json({ success: true, cart: cart.items });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/cart/update
router.put('/update', authenticateToken, async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user?.id || req.sessionId;
    
    if (!productId || quantity < 0) {
      return res.status(400).json({ message: 'Product ID and valid quantity required' });
    }
    
    const db = await connectDB();
    
    // Get cart
    let cart = await db.collection('carts').findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    
    // Find and update item
    const itemIndex = cart.items.findIndex(item => item.productId === productId);
    
    if (itemIndex >= 0) {
      if (quantity === 0) {
        // Remove item
        cart.items.splice(itemIndex, 1);
      } else {
        // Update quantity
        cart.items[itemIndex].quantity = quantity;
      }
      
      // Update cart
      await db.collection('carts').updateOne(
        { userId },
        { 
          $set: { 
            items: cart.items,
            updatedAt: new Date()
          }
        }
      );
      
      res.json({ success: true, cart: cart.items });
    } else {
      res.status(404).json({ message: 'Item not found in cart' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE /api/cart/clear
router.delete('/clear', authenticateToken, async (req, res) => {
  try {
    const userId = req.user?.id || req.sessionId;
    const db = await connectDB();
    
    await db.collection('carts').updateOne(
      { userId },
      { 
        $set: { 
          items: [],
          updatedAt: new Date()
        }
      }
    );
    
    res.json({ success: true, cart: [] });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
