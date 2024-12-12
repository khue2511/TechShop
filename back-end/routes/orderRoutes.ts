import express from 'express'
import { authenticateToken } from '../middleware/authMiddleware'
import { createOrder, getOrders, updateOrderStatus } from '../controllers/orderControllers'

const router = express.Router()

// GET: Get user's orders by user id
router.get('/', authenticateToken, getOrders)

// POST: Create a new order
router.post('/', authenticateToken, createOrder)

// PUT: Update an order status
router.put('/:orderId', authenticateToken, updateOrderStatus)
export default router