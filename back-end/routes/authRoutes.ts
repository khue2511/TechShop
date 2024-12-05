import express, { Request, Response } from 'express';
import { loginUser, registerUser } from '../controllers/authControllers';
const router = express.Router();

// POST: Register a new user
router.post('/register', registerUser);

// POST: Login a user
router.post('/login', loginUser);

export default router;
