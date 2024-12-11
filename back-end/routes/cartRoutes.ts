import express from 'express';
import { authenticateToken } from '../middleware/authMiddleware';
import {
  addItemToCart,
  clearItemFromCart,
  deleteCart,
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

// DELETE: Remove item completely from cart
router.delete('/clear/:productId', authenticateToken, clearItemFromCart);

// DELETE: Delete cart
router.delete('/', authenticateToken, deleteCart);

export default router;
