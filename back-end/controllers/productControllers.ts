import { Request, Response } from 'express';
import Product from '../models/Product';

// GET: Get all products with pagination
export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 12;
    const skip = (page - 1) * limit;
    const products = await Product.find().skip(skip).limit(limit);
    const total = await Product.countDocuments();
    res.status(200).send({
      products, 
      total,    
      page,     
      pages: Math.ceil(total / limit), 
    });;
  } catch (error) {
    res.status(500).send({ message: 'Internal Server Error', error });
  }
};

// GET: Get product by Id
export const getProductById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404).send({ message: 'Product not found' });
      return;
    }
    res.status(200).send(product);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: 'Internal Server Error', error });
  }
};

// POST: Add new product
export const addProduct = async (req: Request, res: Response) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).send({ message: 'Product added successfully', product });
  } catch (error) {
    res.status(400).send({ message: 'Error adding product', error });
  }
};

// PUT: Update a product
export const updateProduct = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
    );
    if (!updatedProduct) {
      res.status(404).send({ message: 'Product not found' });
      return;
    }
    res.send({ message: 'Product modified!', updatedProduct });
  } catch (error) {
    res.status(500).send({ message: 'Error deleting product', error });
  }
};

// DELETE: delete a product
export const deleteProduct = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).send({ message: 'Product not found' });
    }
    res.send({ message: 'Product deleted successfully', product });
  } catch (error) {
    res.status(500).send({ message: 'Internal server error', error });
  }
};
