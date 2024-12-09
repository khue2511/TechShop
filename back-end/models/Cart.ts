import mongoose, { Document, Schema } from 'mongoose';

interface ICartItem {
  product: mongoose.Types.ObjectId;
  quantity: number;
}

export interface ICart extends Document {
  userId: mongoose.Types.ObjectId;
  cartItems: ICartItem[];
  totalAmount: number;
  totalQuantity: number
}

const CartSchema: Schema<ICart> = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  cartItems: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
      },
    },
  ],
  totalAmount: {
    type: Number,
    required: true,
  },
  totalQuantity: {
    type: Number,
    required: true,
  }
});

export default mongoose.model<ICart>('Cart', CartSchema);
