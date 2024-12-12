import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import { useDispatch } from 'react-redux';
import OrderDetailCard from './OrderDetailCard';
import { fetchOrders } from '../../redux/orders/ordersSlice';

const Orders: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, orders } = useSelector((state: RootState) => state.orders)

  useEffect(() => {
    dispatch(fetchOrders());
  }, []);

  return (
    <div className="container mx-auto mb-4">
      <h1 className="text-3xl font-bold my-4">Your Orders</h1>
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <div className="spinner-border animate-spin inline-block w-16 h-16 border-4 border-solid border-gray-200 border-t-gray-500 rounded-full" />
        </div>
      ) : (
        <div>
          {orders.length === 0 ? (
            <h1>You do not have any orders</h1>
          ) : (
            <div className="flex flex-col gap-y-8">
              {orders.map((order) => (
                <OrderDetailCard
                  key={order._id}
                  id={order._id}
                  userId={order.userId}
                  orderItems={order.orderItems}
                  totalAmount={order.totalAmount}
                  totalQuantity={order.totalQuantity}
                  status={order.status}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Orders;
