import express from 'express';
import cors from 'cors';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// File upload setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'public/uploads';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

// In-memory database (for demo purposes)
let products = [
  {
    _id: '1',
    name: 'Lipstick Set',
    description: 'Premium lipstick collection with 6 shades',
    price: 29.99,
    category: 'Cosmetics',
    stockStatus: 15,
    imageURL: 'https://via.placeholder.com/300x300?text=Lipstick',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: '2',
    name: 'Baby Diapers',
    description: 'Comfortable and absorbent baby diapers',
    price: 19.99,
    category: 'Baby Products',
    stockStatus: 50,
    imageURL: 'https://via.placeholder.com/300x300?text=Diapers',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Routes

// GET all products
app.get('/api/products', (req, res) => {
  const { category, search } = req.query;
  let filteredProducts = products;
  
  if (category && category !== 'All') {
    filteredProducts = filteredProducts.filter(p => p.category === category);
  }
  
  if (search) {
    filteredProducts = filteredProducts.filter(p => 
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase())
    );
  }
  
  res.json(filteredProducts);
});

// GET single product
app.get('/api/products/:id', (req, res) => {
  const product = products.find(p => p._id === req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json(product);
});

// POST create product
app.post('/api/products', upload.single('image'), (req, res) => {
  try {
    const { name, description, price, category, stockStatus, imageURL } = req.body;
    
    const newProduct = {
      _id: Date.now().toString(),
      name: name.trim(),
      description: description.trim(),
      price: parseFloat(price),
      category,
      stockStatus: parseInt(stockStatus),
      imageURL: req.file ? `/uploads/${req.file.filename}` : imageURL.trim() || 'https://via.placeholder.com/300x300?text=No+Image',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    products.push(newProduct);
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT update product
app.put('/api/products/:id', upload.single('image'), (req, res) => {
  try {
    const { name, description, price, category, stockStatus, imageURL } = req.body;
    const index = products.findIndex(p => p._id === req.params.id);
    
    if (index === -1) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    products[index] = {
      ...products[index],
      name: name.trim(),
      description: description.trim(),
      price: parseFloat(price),
      category,
      stockStatus: parseInt(stockStatus),
      imageURL: req.file ? `/uploads/${req.file.filename}` : imageURL.trim() || products[index].imageURL,
      updatedAt: new Date().toISOString()
    };
    
    res.json(products[index]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE product
app.delete('/api/products/:id', (req, res) => {
  const index = products.findIndex(p => p._id === req.params.id);
  
  if (index === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }
  
  products.splice(index, 1);
  res.json({ message: 'Product deleted successfully' });
});

// Auth endpoints (mock)
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  // Mock authentication - accept any email with password "admin123"
  if (password === 'admin123') {
    res.json({
      token: 'mock-jwt-token-' + Date.now(),
      user: { email }
    });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📦 Products API: http://localhost:${PORT}/api/products`);
  console.log(`🔐 Auth API: http://localhost:${PORT}/api/auth/login`);
});
