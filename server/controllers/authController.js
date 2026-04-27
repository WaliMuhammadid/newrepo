import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';

/**
 * Generate JWT Token
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

/**
 * @desc    Login admin user
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      const error = new Error('Please provide email and password');
      error.status = 400;
      throw error;
    }

    // Find admin by email
    const admin = await Admin.findOne({ email });

    if (!admin) {
      const error = new Error('Invalid credentials');
      error.status = 401;
      throw error;
    }

    // Check password
    const isMatch = await admin.comparePassword(password);

    if (!isMatch) {
      const error = new Error('Invalid credentials');
      error.status = 401;
      throw error;
    }

    // Generate JWT token
    const token = generateToken(admin._id);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: admin._id,
        email: admin.email,
        name: admin.name,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get current admin profile
 * @route   GET /api/auth/me
 * @access  Private
 */
export const getMe = async (req, res, next) => {
  try {
    const admin = await Admin.findById(req.admin.id).select('-password');

    if (!admin) {
      const error = new Error('Admin not found');
      error.status = 404;
      throw error;
    }

    res.status(200).json(admin);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Register admin (for initial setup)
 * @route   POST /api/auth/register
 * @access  Public - Consider protecting or removing in production
 */
export const register = async (req, res, next) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password) {
      const error = new Error('Please provide email and password');
      error.status = 400;
      throw error;
    }

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      const error = new Error('Admin already exists');
      error.status = 400;
      throw error;
    }

    const admin = await Admin.create({
      email,
      password,
      name: name || 'Admin',
    });

    const token = generateToken(admin._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: admin._id,
        email: admin.email,
        name: admin.name,
      },
    });
  } catch (error) {
    next(error);
  }
};
