import express from 'express';
import { authenticateToken } from '../middleware/authMiddleware';
import {
  addItemToCart,
  getCart,
  removeItemFromCart,
} from '../controllers/cartControllers';

const router = express.Router();

// GET: Get user's cart by user id
router.get('/', authenticateToken, getCart);

// POST: Add item to cart
router.post('/add', authenticateToken, addItemToCart);

// DELETE: Remove item from cart
router.delete('/remove/:productId', authenticateToken, removeItemFromCart);

export default router;
