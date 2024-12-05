import { Request, Response } from 'express';
import User from '../models/User';

// GET: Get all users
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find();
    res.status(200).send(users);
  } catch (error) {
    res.status(500).send({ message: 'Internal server error', error });
  }
};

// GET: Get a specific user profile
export const getUserProfile = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const userId = req.params.id;
    if (req.user?.id !== userId) {
      return res.status(403).json({ message: 'Unauthorized access' });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }
    res.status(200).send({ username: user.username, email: user.email });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: 'Internal server error', error });
  }
};
