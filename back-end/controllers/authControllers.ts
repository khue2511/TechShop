import { Request, Response } from 'express';
import User, { IUser } from '../models/User';
import { hashPassword } from '../utils/passwordUtils';
import bcrypt from 'bcrypt';
import { generateAccessToken, generateRefreshToken } from '../utils/tokenUtils';
import jwt, { JwtPayload } from 'jsonwebtoken';

// POST: Register a new user
export const registerUser = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { username, email, password } = req.body;

  if (!email || !username || !password) {
    res.status(400).json({ message: 'Please provide all required fields' });
    return;
  }

  try {
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      res.status(400).json({ message: 'Username or email already exists' });
      return;
    }

    const hashedPassword = await hashPassword(password);
    const user: IUser = new User({ username, email, password: hashedPassword });
    await user.save();
    res.status(201).send({ message: 'User registered successfully', user });
  } catch (error) {
    res.status(500).send({ message: 'Error registering user', error });
  }
};

// POST: Login a user
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400).json({ message: 'Please provide all required fields' });
    return;
  }

  try {
    const user = await User.findOne({ username: req.body.username });
    // Check if user exists
    if (!user) {
      res.status(404).json({ message: 'User does not exist' });
      return;
    }

    // Check if password is valid
    const isValidPassword = await bcrypt.compare(
      req.body.password,
      user.password,
    );

    if (!isValidPassword) {
      res.status(401).json({ message: 'Incorrect password' });
      return;
    }

    // User authenticated, generate token
    const payload = {
      id: user.id,
      username: user.username,
    };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);
    res.status(200).json({
      message: 'Logged in!',
      id: user.id,
      username: user.username,
      email: user.email,
      accessToken: accessToken,
      refreshToken: refreshToken,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: 'Internal server error', error });
  }
};

// POST: Refresh the token
export const refreshToken = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    res.status(400).send({ message: 'Refresh token is required' });
    return;
  }

  try {
    const secret = process.env.REFRESH_TOKEN_SECRET;
    if (!secret) {
      throw new Error('REFRESH_TOKEN_SECRET is not defined in the environment');
    }

    jwt.verify(refreshToken, secret, async (err: any, decoded: any) => {
      if (err) {
        return res.status(401).json({ message: 'Invalid or expired refresh token' });
      }

      const existingUser = await User.findById(decoded.id);
      if (!existingUser) {
        return res.status(404).json({ message: 'User not found' });
      }

      const payload = {
        id: existingUser.id,
        username: existingUser.username,
      };

      const newAccessToken = generateAccessToken(payload);
      const newRefreshToken = generateRefreshToken(payload);

      res.status(200).json({
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      });
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: 'Internal server error', error });
  }
};

// GET: Get the current user info
export const getCurrentUser = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user?.id;
    const user = await User.findById(userId);
    if (user) {
      res
        .status(200)
        .send({ id: user.id, username: user.username, email: user.email });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: 'Internal server error' });
  }
};
