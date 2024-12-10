import { Product } from './productTypes';

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Cart {
  _id: string;
  userId: string;
  cartItems: CartItem[];
  totalAmount: number;
  totalQuantity: number
}
