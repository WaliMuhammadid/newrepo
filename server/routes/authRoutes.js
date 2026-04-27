import express from 'express';
import { login, getMe, register } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/login', login);
router.post('/register', register); // For initial admin setup
router.get('/me', protect, getMe);

export default router;
