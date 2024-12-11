import { Request, Response } from 'express';
import Cart from '../models/Cart';
import Product from '../models/Product';
import mongoose from 'mongoose';

// GET: Get user's cart by user id
export const getCart = async (req: Request, res: Response): Promise<void> => {
  try {
    const cart = await Cart.findOne({ userId: req.user?.id }).populate(
      'cartItems.product',
    );
    if (!cart) {
      res.status(404).json({ message: 'Cart not found' });
      return;
    }
    res.status(200).json(cart);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// POST: Add item to cart
export const addItemToCart = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { productId, quantity } = req.body;
    if (!productId || !quantity) {
      res.status(400).json({ message: 'Please provide all required fields' });
      return;
    }
    const product = await Product.findById(productId);
    if (!product) {
      res.status(404).json({ message: 'Product does not exist' });
      return;
    }

    // Check if the requested quantity is available in stock
    if (quantity > product.quantity) {
      res.status(400).json({
        message: `Insufficient stock. Only ${product.quantity} items available.`,
      });
      return;
    }

    const cart = await Cart.findOne({ userId: req.user?.id });

    if (cart) {
      const itemIndex = cart.cartItems.findIndex((item) =>
        item.product.equals(productId),
      );
      if (itemIndex > -1) {
        if (cart.cartItems[itemIndex].quantity + quantity > product.quantity) {
          res.status(400).json({
            message: `Cannot add more than ${product.quantity} items to the cart.`,
          });
          return;
        }
        // Product exists in cart, update quantity
        cart.cartItems[itemIndex].quantity += quantity;
        cart.totalAmount += product.price * quantity;
        cart.totalQuantity += quantity;
      } else {
        // Product does not exist in cart, add new item
        cart.cartItems.push({ product: productId, quantity });
        cart.totalAmount += product.price * quantity;
        cart.totalQuantity += quantity;
      }
      await cart.save();
      res.status(201).json(cart);
    } else {
      // No cart for user, create new cart
      const cart = new Cart({
        userId: req.user?.id,
        cartItems: [{ product: productId, quantity }],
        totalAmount: product.price * quantity,
        totalQuantity: quantity,
      });

      await cart.save();
      res.status(201).json(cart);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// DELETE: Remove items from cart
export const removeItemFromCart = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const productId = req.params.productId;
    const product = await Product.findById(productId);
    if (!product) {
      res.status(404).json({ message: 'Product does not exist' });
      return;
    }

    const cart = await Cart.findOne({ userId: req.user?.id });
    if (!cart) {
      res.status(404).json({ message: 'Cart not found' });
      return;
    }

    const itemIndex = cart.cartItems.findIndex((item) =>
      item.product.equals(productId),
    );

    if (itemIndex >= 0) {
      const cartItem = cart.cartItems[itemIndex];

      if (cartItem.quantity === 1) {
        cart.cartItems.splice(itemIndex, 1);
      } else {
        cartItem.quantity -= 1;
      }

      cart.totalAmount -= product.price;
      cart.totalQuantity -= 1;

      await cart.save();
      res.status(200).json({ message: 'Item removed from cart', cart });
      return;
    } else {
      res.status(404).json({ message: 'Product not found in cart' });
      return;
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// DELETE: Remove item completely from cart
export const clearItemFromCart = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const productId = req.params.productId;
    const product = await Product.findById(productId);
    if (!product) {
      res.status(404).json({ message: 'Product does not exist' });
      return;
    }

    const cart = await Cart.findOne({ userId: req.user?.id });
    if (!cart) {
      res.status(404).json({ message: 'Cart not found' });
      return;
    }

    const itemIndex = cart.cartItems.findIndex((item) =>
      item.product.equals(productId),
    );
    if (itemIndex >= 0) {
      cart.cartItems = cart.cartItems.filter(
        (item) => item.product.toString() !== productId,
      );
      await cart.save();
      res.status(200).json({ message: 'Item cleared from cart' });
    } else {
      res.status(404).json({ message: 'Product not found in cart' });
      return;
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

// DELETE: Delete cart
export const deleteCart = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      res.status(404).json({ message: 'Cart not found' });
      return;
    }
    await Cart.deleteOne({ userId });
    res.status(200).json({ message: 'Cart deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};
