import axios from 'axios';
import type { LoginCredentials } from '@/types';

// ============================================
// CONFIGURATION
// ============================================
const API_BASE = (import.meta.env?.VITE_API_URL as string) || 'http://localhost:5000/api';

const axiosInstance = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token to every request
axiosInstance.interceptors.request.use((config) => {
  const adminRaw = localStorage.getItem('mumtaz_admin');
  if (adminRaw) {
    try {
      const admin = JSON.parse(adminRaw);
      if (admin?.token) {
        config.headers.Authorization = `Bearer ${admin.token}`;
      }
    } catch {
      // ignore
    }
  }
  return config;
});

// ============================================
// KEYS (only used for admin token)
// ============================================
const ADMIN_KEY = 'mumtaz_admin';

// ============================================
// REAL API IMPLEMENTATION (MongoDB via Express)
// ============================================
export const api = {
  // ---------- AUTH ----------
  login: async (credentials: LoginCredentials) => {
    const res = await axiosInstance.post('/auth/login', credentials);
    if (res.data.token) {
      localStorage.setItem(
        ADMIN_KEY,
        JSON.stringify({ email: res.data.user?.email, token: res.data.token })
      );
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

  // ---------- PRODUCTS ----------
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

  // ---------- CART ----------
  getCart: async () => {
    const res = await axiosInstance.get('/cart');
    return res.data;
  },

  addToCart: async (productId: string, quantity: number = 1) => {
    const res = await axiosInstance.post('/cart', { productId, quantity });
    return res.data;
  },

  updateCartItem: async (productId: string, quantity: number) => {
    const res = await axiosInstance.put('/cart', { productId, quantity });
    return res.data;
  },

  removeFromCart: async (productId: string) => {
    const res = await axiosInstance.delete(`/cart/${productId}`);
    return res.data;
  },

  clearCart: async () => {
    const res = await axiosInstance.delete('/cart');
    return res.data;
  },
};

// ============================================
// CART HELPERS (Now using database instead of localStorage)
// ============================================