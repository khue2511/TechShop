import express, { Request, Response } from 'express';
import User from '../models/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const router = express.Router();

// GET: Return all users
router.get('/', async (req: Request, res: Response) => {
  try {
    const users = await User.find();
    res.status(200).send(users);
  } catch (error) {
    res.status(500).send(error);
  }
});

// POST: Register a new user
router.post('/register', async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  try {
    const user = new User({ username, email, password });
    await user.save();
    res.status(201).send({ message: 'User registered successfully', user });
  } catch (error) {
    res.status(500).send({ message: 'Error registering user', error });
  }
});

// POST: Login
router.post('/login', async (req: Request, res: Response) => {
  const user = await User.findOne({ username: req.body.username });
  if (user) {
    const isValidPassword = await bcrypt.compare(
      req.body.password,
      user.password,
    );
    if (isValidPassword) {
      const secret = process.env.ACCESS_TOKEN_SECRET;
      if (!secret) {
        throw new Error(
          'ACCESS_TOKEN_SECRET is not defined in the environment',
        );
      }
      const accessToken = jwt.sign(user.username, secret);
      res.status(200).json({ message: 'Logged in!', accessToken: accessToken });
    } else {
      res.status(401).json({ message: 'Incorrect password' });
    }
  } else {
    res.status(404).json({ message: 'Username does not exist' });
  }
});

export default router;
 