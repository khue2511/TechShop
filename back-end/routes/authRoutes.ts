import express, { Request, Response } from 'express';
import { getCurrentUser, loginUser, refreshToken, registerUser } from '../controllers/authControllers';
import { authenticateToken } from '../middleware/authMiddleware';
const router = express.Router();

// POST: Register a new user
router.post('/register', registerUser);

// POST: Login a user
router.post('/login', loginUser);

// GET: Get current user info 
router.get('/me', authenticateToken, getCurrentUser)

// POST: Refresh access token
router.post('/refresh', refreshToken)
export default router;
