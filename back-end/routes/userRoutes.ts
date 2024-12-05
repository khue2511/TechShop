import express, { Request, Response } from 'express';
import User from '../models/User';
import { authenticateToken } from '../middleware/authMiddleware';

const router = express.Router();

// GET: Return all users
router.get('/', async (req: Request, res: Response) => {
  try {
    const users = await User.find();
    res.status(200).send(users);
  } catch (error) {
    res.status(500).send({ message: 'Internal server error', error });
  }
});

// GET: Get a specific user profile
router.get(
  '/:id',
  authenticateToken,
  async (req: Request, res: Response): Promise<any> => {
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
  },
);

// PUT: Update a specific's user details
// router.put('/:id', async (req: Request, res: Response): Promise<any> => {
//   try {
//     const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//     });
//     if (!updatedUser) {
//       return res.status(404).send({ message: 'User not found' });
//     }

//     res.send({ message: 'User updated!', updatedUser });
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({ message: 'Internal server error', error });
//   }
// });

// DELETE: Delete a specific user
// router.delete('/:id', async (req: Request, res: Response): Promise<any> => {
//   try {
//     const deletedUser = await User.findByIdAndDelete(req.params.id);

//     if (!deletedUser) {
//       return res.status(404).send({ message: 'User not found' });
//     }
//     res.send({ message: 'User deleted successfully', deletedUser });
//   } catch (error) {
//     res.status(500).send({ message: 'Internal server error', error });
//   }
// });

export default router;
