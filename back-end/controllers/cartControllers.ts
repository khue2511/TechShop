import { Request, Response } from 'express';
import Cart from '../models/Cart';
import Product from '../models/Product';

// GET: Get user's cart by user id
export const getCart = async (req: Request, res: Response): Promise<any> => {
  try {
    const cart = await Cart.findOne({ userId: req.user?.id }).populate(
      'cartItems.product',
    );
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
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
): Promise<any> => {
  const { productId, quantity } = req.body;
  if (!productId || !quantity) {
    return res
      .status(400)
      .json({ message: 'Please provide all required fields' });
  }

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const cart = await Cart.findOne({ userId: req.user?.id });

    if (cart) {
      const itemIndex = cart.cartItems.findIndex((item) =>
        item.product.equals(productId),
      );
      if (itemIndex > -1) {
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
export const removeItemFromCart = async (req: Request, res: Response): Promise<any> => {
  const productId = req.params.productId;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const cart = await Cart.findOne({ userId: req.user?.id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
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
      return res.status(200).json({ message: 'Item removed from cart', cart });
    } else {
      return res.status(404).json({ message: 'Product not found in cart' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
