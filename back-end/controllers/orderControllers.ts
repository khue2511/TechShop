import { Request, Response } from 'express';
import Order, { IOrderItem } from '../models/Order';
import Product from '../models/Product';

// GET: Get user's orders by user id
export const getOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    const orders = await Order.find({ userId: req.user?.id }).populate(
      'orderItems.product',
    );
    if (!orders || orders.length === 0) {
      res.status(404).json({ message: 'No orders available' });
      return;
    }
    res.status(200).json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// POST: Create a new order
export const createOrder = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { orderItems } = req.body;

  // Validate if orderItems are provided
  if (!orderItems || orderItems.length === 0) {
    res.status(400).json({ message: 'Order must contain at least one item' });
    return;
  }

  try {
    // Fetch the user ID from the request 
    const userId = req.user?.id;

    // Validate if each product exists and check stock quantities
    let totalAmount = 0;
    let totalQuantity = 0;
    const orderItemsDetails: IOrderItem[] = [];

    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      if (!product) {
        res
          .status(404)
          .json({ message: `Product with ID ${item.product} not found` });
        return;
      }

      if (item.quantity > product.quantity) {
        res.status(400).json({
          message: `Insufficient stock for product ${product.name}. Available: ${product.quantity}, Requested: ${item.quantity}`,
        });
        return;
      }

      // Update the total amount and quantity
      totalAmount += product.price * item.quantity;
      totalQuantity += item.quantity;

      // Add to the order items details
      orderItemsDetails.push({
        product: item.product,
        quantity: item.quantity,
      });

      // Optionally, reduce stock in the Product model (if you want to update stock)
      product.quantity -= item.quantity;
      await product.save();
    }

    // Create the new order
    const newOrder = new Order({
      userId,
      orderItems: orderItemsDetails,
      totalAmount,
      totalQuantity,
      status: 'pending', // Default status is 'pending'
    });

    // Save the order to the database
    await newOrder.save();
    const populatedOrder = await newOrder.populate('orderItems.product');

    // Return the newly created order
    res.status(201).json(populatedOrder);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
