import express, { Request, Response } from 'express';
import { authenticateToken } from '../middleware/authMiddleware';
import { getAllUsers, getUserProfile } from '../controllers/userControllers';

const router = express.Router();

// GET: Return all users
router.get('/', getAllUsers);

// GET: Get a specific user profile
router.get('/:id', authenticateToken, getUserProfile);

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
