import { Product } from './productTypes';

export interface OrderItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  orderItems: OrderItem[];
  totalAmount: number;
  totalQuantity: number;
  status: string;
}
