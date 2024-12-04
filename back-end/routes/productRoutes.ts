import express, { Request, Response } from 'express';
import Product from '../models/Product';
import { authenticateToken } from '../middleware/authMiddleware';

const router = express.Router();

// GET: Get all products
router.get('/', authenticateToken, async (req: Request, res: Response) => {
  try {
    const products = await Product.find();
    res.status(200).send(products);
  } catch (error) {
    res.status(500).send({ message: 'Internal Server Error', error });
  }
});

// GET: Get product by id
router.get('/:id', async (req: Request, res: Response): Promise<any> => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).send({ message: 'Product not found' });
    }
    res.status(200).send(product);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: 'Internal Server Error', error });
  }
});

// POST: Add new product
router.post('/', async (req: Request, res: Response) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).send({ message: 'Product added successfully', product });
  } catch (error) {
    res.status(400).send({ message: 'Error adding product', error });
  }
});

// PUT: Update product
router.put('/:id', async (req: Request, res: Response): Promise<any> => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
    );
    if (!updatedProduct) {
      return res.status(404).send({ message: 'Product not found' });
    }
    res.send({ message: 'Product modified!', updatedProduct });
  } catch (error) {
    res.status(500).send({ message: 'Error deleting product', error });
  }
});

// DELETE: Delete a product
router.delete('/:id', async (req: Request, res: Response): Promise<any> => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).send({ message: 'Product not found' });
    }
    res.send({ message: 'Product deleted successfully', product });
  } catch (error) {
    res.status(500).send({ message: 'Internal server error', error });
  }
});
 
export default router;
