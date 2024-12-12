import React from 'react';
import { OrderItem } from '../../types/orderTypes';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../redux/store';
import { updateOrderStatus } from '../../redux/orders/ordersSlice';

interface OrderDetailCardProps {
  id: string;
  userId: string;
  totalAmount: number;
  totalQuantity: number;
  status: string;
  orderItems: OrderItem[];
}

const OrderDetailCard: React.FC<OrderDetailCardProps> = ({
  id,
  totalAmount,
  status,
  orderItems,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const handleCancelOrder = () => {
    dispatch(updateOrderStatus({ orderId: id, status: 'cancelled' }));
  };

  const handleConfirmOrder = () => {
    dispatch(updateOrderStatus({ orderId: id, status: 'confirmed' }));
  };

  return (
    <div className="border rounded shadow-lg">
      <p className="flex items-center gap-x-2 p-4 border-b">
        <span className="text-lg font-bold"> Order ID: {id}</span>
        <span
          className={`font-semibold text-xs px-3.5 py-1 rounded-3xl ${
            status === 'pending'
              ? 'bg-zinc-200'
              : status === 'confirmed'
                ? 'bg-green-500 text-white'
                : 'bg-rose-700 text-white'
          } `}
        >
          {status}
        </span>
      </p>

      <div className="border-b grid grid-cols-5 bg-zinc-100 p-4">
        <span className="col-span-3 font-semibold text-blue-900">
          Product Name
        </span>
        <span className="text-right font-semibold text-blue-900">
          Qty x Price
        </span>
        <span className="text-right font-semibold text-blue-900">Total</span>
      </div>
      <div className="flex flex-col">
        {orderItems.map((item) => (
          <div
            className="border-b grid grid-cols-5 p-4"
            key={item.product._id}
          >
            <div className="flex flex-col gap-y-1 col-span-3 sm:flex-row sm:gap-x-4">
              <img
                className="w-24 h-24 rounded"
                src={item.product.imageUrl}
                alt={item.product.name}
              />
              <div>
                <p className="text-sm text-gray-400">
                  Product ID: {item.product._id}
                </p>
                <p className="text-lg font-semibold">{item.product.name}</p>
              </div>
            </div>
            <p className="text-right">
              {item.quantity} x{' '}
              <span className="font-semibold">${item.product.price}</span>
            </p>
            <p className="font-semibold text-right">
              ${item.product.price * item.quantity}
            </p>
          </div>
        ))}
        <div className="border-b grid grid-cols-5 p-4">
          <p className="col-start-3 sm:col-start-4 col-end-5 text-right font-semibold">
            Total Amount:
          </p>
          <span className="text-right text-xl font-bold">${totalAmount}</span>
        </div>
      </div>
      {status == 'pending' ? (
        <div className="flex justify-end gap-x-4 border-b p-4">
          <button
            className="bg-red-500 text-white px-4 py-2 hover:bg-red-700 transition duration-100"
            onClick={handleCancelOrder}
          >
            Cancel Order
          </button>
          <button
            className="bg-black text-white px-4 py-2 hover:bg-white hover:text-black border transition duration-100"
            onClick={handleConfirmOrder}
          >
            <ShoppingCartCheckoutIcon /> Checkout
          </button>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default OrderDetailCard;
