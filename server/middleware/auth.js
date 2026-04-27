import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';

/**
 * Middleware to protect admin routes
 * Verifies JWT token from Authorization header
 */
export const protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    // Check if token exists
    if (!token) {
      const error = new Error('Not authorized, no token provided');
      error.status = 401;
      throw error;
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach admin to request object (excluding password)
      req.admin = await Admin.findById(decoded.id).select('-password');

      if (!req.admin) {
        const error = new Error('Admin not found, token invalid');
        error.status = 401;
        throw error;
      }

      next();
    } catch (jwtError) {
      const error = new Error('Not authorized, token failed or expired');
      error.status = 401;
      throw error;
    }
  } catch (error) {
    next(error);
  }
};
