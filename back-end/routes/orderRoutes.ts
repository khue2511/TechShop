import express from 'express'
import { authenticateToken } from '../middleware/authMiddleware'
import { createOrder, getOrders } from '../controllers/orderControllers'

const router = express.Router()

// GET: Get user's orders by user id
router.get('/', authenticateToken, getOrders)

// POST: Create a new order
router.post('/', authenticateToken, createOrder)
export default router