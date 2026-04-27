import axios from 'axios';
import type { Product, LoginCredentials } from '@/types';

// ============================================
// CONFIGURATION
// Set USE_MOCK to false when connecting to real backend
// ============================================
const USE_MOCK = true;
const API_BASE = (import.meta.env?.VITE_API_URL as string) || 'http://localhost:5000/api';

const axiosInstance = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token to requests
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ============================================
// MOCK DATA & HELPERS
// ============================================
const STORAGE_KEY = 'mumtaz_products';
const ADMIN_KEY = 'mumtaz_admin';
const CART_KEY = 'mumtaz_cart';

const generateId = () => Math.random().toString(36).substring(2, 15) + Date.now().toString(36);

const seedProducts: Product[] = [
  {
    _id: generateId(),
    name: 'Rose Glow Face Serum',
    description: 'A luxurious rose-infused serum that hydrates and brightens your skin. Contains natural rose extract, hyaluronic acid, and vitamin C for a radiant glow.',
    price: 29.99,
    category: 'Cosmetics',
    imageURL: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&auto=format&fit=crop&q=60',
    stockStatus: 45,
    createdAt: new Date().toISOString(),
  },
  {
    _id: generateId(),
    name: 'Velvet Matte Lipstick',
    description: 'Long-lasting velvet matte lipstick in rich, pigmented shades. Infused with shea butter for comfortable all-day wear.',
    price: 18.50,
    category: 'Cosmetics',
    imageURL: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=500&auto=format&fit=crop&q=60',
    stockStatus: 120,
    createdAt: new Date().toISOString(),
  },
  {
    _id: generateId(),
    name: 'Organic Baby Lotion',
    description: 'Gentle, fragrance-free baby lotion made with organic aloe vera and calendula. Perfect for sensitive newborn skin.',
    price: 14.99,
    category: 'Baby Products',
    imageURL: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df4?w=500&auto=format&fit=crop&q=60',
    stockStatus: 80,
    createdAt: new Date().toISOString(),
  },
  {
    _id: generateId(),
    name: 'Hydrating Night Cream',
    description: 'Deeply nourishing night cream with retinol and peptides. Wake up to smoother, firmer, and more youthful-looking skin.',
    price: 34.99,
    category: 'Cosmetics',
    imageURL: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=500&auto=format&fit=crop&q=60',
    stockStatus: 30,
    createdAt: new Date().toISOString(),
  },
  {
    _id: generateId(),
    name: 'Baby Soft Diapers Pack',
    description: 'Ultra-soft, hypoallergenic diapers with wetness indicator. Provides up to 12 hours of leakage protection for your little one.',
    price: 24.99,
    category: 'Baby Products',
    imageURL: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500&auto=format&fit=crop&q=60',
    stockStatus: 200,
    createdAt: new Date().toISOString(),
  },
  {
    _id: generateId(),
    name: 'Vitamin E Eye Cream',
    description: 'Revitalizing eye cream with vitamin E and caffeine. Reduces dark circles and puffiness for a refreshed appearance.',
    price: 22.00,
    category: 'Cosmetics',
    imageURL: 'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=500&auto=format&fit=crop&q=60',
    stockStatus: 55,
    createdAt: new Date().toISOString(),
  },
  {
    _id: generateId(),
    name: 'Natural Baby Shampoo',
    description: 'Tear-free baby shampoo with chamomile and lavender. Gently cleanses without drying or irritating delicate skin and eyes.',
    price: 12.99,
    category: 'Baby Products',
    imageURL: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=500&auto=format&fit=crop&q=60',
    stockStatus: 65,
    createdAt: new Date().toISOString(),
  },
  {
    _id: generateId(),
    name: 'Glow Setting Spray',
    description: 'Weightless setting spray that locks makeup in place for up to 16 hours. Provides a natural dewy finish with hydration boost.',
    price: 16.99,
    category: 'Cosmetics',
    imageURL: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500&auto=format&fit=crop&q=60',
    stockStatus: 90,
    createdAt: new Date().toISOString(),
  },
  {
    _id: generateId(),
    name: 'Baby Feeding Bottles Set',
    description: 'BPA-free feeding bottles with anti-colic vent system. Includes 3 bottles in varying sizes with soft silicone nipples.',
    price: 19.99,
    category: 'Baby Products',
    imageURL: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=500&auto=format&fit=crop&q=60',
    stockStatus: 40,
    createdAt: new Date().toISOString(),
  },
  {
    _id: generateId(),
    name: 'Charcoal Detox Mask',
    description: 'Purifying charcoal mask that draws out impurities and minimizes pores. Enriched with tea tree oil for clearer skin.',
    price: 21.50,
    category: 'Cosmetics',
    imageURL: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=500&auto=format&fit=crop&q=60',
    stockStatus: 35,
    createdAt: new Date().toISOString(),
  },
  {
    _id: generateId(),
    name: 'Baby Muslin Swaddle Blankets',
    description: 'Pack of 4 breathable muslin swaddle blankets. Soft, lightweight, and perfect for wrapping your newborn comfortably.',
    price: 27.99,
    category: 'Baby Products',
    imageURL: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=500&auto=format&fit=crop&q=60',
    stockStatus: 50,
    createdAt: new Date().toISOString(),
  },
  {
    _id: generateId(),
    name: 'Nude Palette Eyeshadow',
    description: '12-shade nude eyeshadow palette with matte and shimmer finishes. Highly pigmented, blendable, and long-wearing formula.',
    price: 32.00,
    category: 'Cosmetics',
    imageURL: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500&auto=format&fit=crop&q=60',
    stockStatus: 70,
    createdAt: new Date().toISOString(),
  },
];

function getMockProducts(): Product[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seedProducts));
    return seedProducts;
  }
  return JSON.parse(stored);
}

function saveMockProducts(products: Product[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}

// ============================================
// MOCK API IMPLEMENTATION
// ============================================
const mockAPI = {
  // Auth
  login: async (credentials: LoginCredentials) => {
    await new Promise((r) => setTimeout(r, 800));
    if (credentials.email === 'admin@mumtazstore.com' && credentials.password === 'admin123') {
      const token = 'mock_jwt_token_' + Date.now();
      localStorage.setItem(ADMIN_KEY, JSON.stringify({ email: credentials.email, token }));
      return { success: true, token, user: { email: credentials.email } };
    }
    throw new Error('Invalid email or password');
  },

  logout: () => {
    localStorage.removeItem(ADMIN_KEY);
  },

  getAdmin: () => {
    const stored = localStorage.getItem(ADMIN_KEY);
    return stored ? JSON.parse(stored) : null;
  },

  // Products
  getProducts: async (category?: string, search?: string) => {
    await new Promise((r) => setTimeout(r, 500));
    let products = getMockProducts();
    if (category && category !== 'All') {
      products = products.filter((p) => p.category === category);
    }
    if (search) {
      const q = search.toLowerCase();
      products = products.filter(
        (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
      );
    }
    return products;
  },

  getProduct: async (id: string) => {
    await new Promise((r) => setTimeout(r, 400));
    const products = getMockProducts();
    const product = products.find((p) => p._id === id);
    if (!product) throw new Error('Product not found');
    return product;
  },

  createProduct: async (data: FormData) => {
    await new Promise((r) => setTimeout(r, 800));
    const products = getMockProducts();
    const imageFile = data.get('image') as File;
    let imageURL = 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=500&auto=format&fit=crop&q=60';

    if (imageFile && imageFile.size > 0) {
      imageURL = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(imageFile);
      });
    } else if (data.get('imageURL')) {
      const url = data.get('imageURL') as string;
      if (url.trim()) imageURL = url.trim();
    }

    const newProduct: Product = {
      _id: generateId(),
      name: (data.get('name') as string)?.trim() || 'Untitled Product',
      description: (data.get('description') as string)?.trim() || '',
      price: Number(data.get('price')) || 0,
      category: (data.get('category') as 'Cosmetics' | 'Baby Products') || 'Cosmetics',
      imageURL,
      stockStatus: Number(data.get('stockStatus')) || 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    products.push(newProduct);
    saveMockProducts(products);
    return newProduct;
  },

  updateProduct: async (id: string, data: FormData) => {
    await new Promise((r) => setTimeout(r, 800));
    const products = getMockProducts();
    const index = products.findIndex((p) => p._id === id);
    if (index === -1) throw new Error('Product not found');

    const imageFile = data.get('image') as File;
    let imageURL = products[index].imageURL;

    if (imageFile && imageFile.size > 0) {
      imageURL = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(imageFile);
      });
    } else if (data.get('imageURL')) {
      const url = data.get('imageURL') as string;
      if (url.trim()) imageURL = url.trim();
    }

    products[index] = {
      ...products[index],
      name: (data.get('name') as string)?.trim() || products[index].name,
      description: (data.get('description') as string)?.trim() || products[index].description,
      price: Number(data.get('price')) ?? products[index].price,
      category: (data.get('category') as 'Cosmetics' | 'Baby Products') || products[index].category,
      imageURL,
      stockStatus: Number(data.get('stockStatus')) ?? products[index].stockStatus,
      updatedAt: new Date().toISOString(),
    };
    saveMockProducts(products);
    return products[index];
  },

  deleteProduct: async (id: string) => {
    await new Promise((r) => setTimeout(r, 600));
    const products = getMockProducts();
    const filtered = products.filter((p) => p._id !== id);
    if (filtered.length === products.length) throw new Error('Product not found');
    saveMockProducts(filtered);
    return { success: true };
  },
};

// ============================================
// REAL API IMPLEMENTATION (Axios)
// ============================================
const realAPI = {
  login: async (credentials: LoginCredentials) => {
    const res = await axiosInstance.post('/auth/login', credentials);
    if (res.data.token) {
      localStorage.setItem(ADMIN_KEY, JSON.stringify({ email: res.data.user?.email, token: res.data.token }));
    }
    return res.data;
  },

  logout: () => {
    localStorage.removeItem(ADMIN_KEY);
  },

  getAdmin: () => {
    const stored = localStorage.getItem(ADMIN_KEY);
    return stored ? JSON.parse(stored) : null;
  },

  getProducts: async (category?: string, search?: string) => {
    const params = new URLSearchParams();
    if (category && category !== 'All') params.append('category', category);
    if (search) params.append('search', search);
    const res = await axiosInstance.get(`/products?${params.toString()}`);
    return res.data;
  },

  getProduct: async (id: string) => {
    const res = await axiosInstance.get(`/products/${id}`);
    return res.data;
  },

  createProduct: async (data: FormData) => {
    const res = await axiosInstance.post('/products', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  updateProduct: async (id: string, data: FormData) => {
    const res = await axiosInstance.put(`/products/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  deleteProduct: async (id: string) => {
    const res = await axiosInstance.delete(`/products/${id}`);
    return res.data;
  },
};

// ============================================
// EXPORT
// ============================================
export const api = USE_MOCK ? mockAPI : realAPI;

// Cart helpers
export const getCart = () => {
  const stored = localStorage.getItem(CART_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const saveCart = (cart: any[]) => {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
};
