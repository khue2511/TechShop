import express, { Request, Response } from 'express';
import Product from '../models/Product';
import { addProduct, deleteProduct, getAllProducts, getProductById, updateProduct } from '../controllers/productControllers';

const router = express.Router();

// GET: Get all products
router.get('/', getAllProducts);

// GET: Get product by id
router.get('/:id', getProductById);

// POST: Add new product
router.post('/', addProduct);

// PUT: Update product
router.put('/:id', updateProduct);

// DELETE: Delete a product
router.delete('/:id', deleteProduct);
 
export default router;
