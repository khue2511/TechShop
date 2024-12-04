import express, { Request, Response } from 'express';
import User from '../models/User';
import bcrypt from 'bcrypt';
import { generateAccessToken, generateRefreshToken } from '../utils/tokenUtils';
const router = express.Router();

// POST: Register a new user
router.post('/register', async (req: Request, res: Response): Promise<any> => {
  const { username, email, password } = req.body;

  if (!email || !username || !password) {
    return res
      .status(400)
      .json({ message: 'Please provide all required fields' });
  }

  try {
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: 'Username or email already exists' });
    }

    const user = new User({ username, email, password });
    await user.save();
    res.status(201).send({ message: 'User registered successfully', user });
  } catch (error) {
    res.status(500).send({ message: 'Error registering user', error });
  }
});

// POST: Login
router.post('/login', async (req: Request, res: Response): Promise<any> => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: 'Please provide all required fields' });
  }

  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      return res.status(404).json({ message: 'User does not exist' });
    }

    const isValidPassword = await bcrypt.compare(
      req.body.password,
      user.password,
    );

    if (!isValidPassword) {
      return res.status(401).json({ message: 'Incorrect password' });
    }

    const accessToken = generateAccessToken(user.username);
    const refreshToken = generateRefreshToken(user.username);
    res.status(200).json({
      message: 'Logged in!',
      accessToken: accessToken,
      refreshToken: refreshToken,
    });
  } catch (error) {
    res.status(500).send({ message: 'Internal server error', error });
  }
});

export default router;
