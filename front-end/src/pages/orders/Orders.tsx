import axios, { AxiosResponse } from 'axios';
import React, { useEffect, useState } from 'react';
import { Order } from '../../types/orderTypes';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { useDispatch } from 'react-redux';
import { logout } from '../../redux/auth/authSlice';
import OrderDetailCard from './OrderDetailCard';
import { resetCart } from '../../redux/cart/cartSlice';

const Orders: React.FC = () => {
  const dispatch = useDispatch();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { accessToken } = useSelector((state: RootState) => state.auth);

  const url = process.env.REACT_APP_API_BASE_URL as string;

  const getOrders = async () => {
    try {
      const response: AxiosResponse = await axios.get(`${url}/orders`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setOrders(response.data);
      console.log(response.data);
      setLoading(false);
    } catch (error: any) {
      console.error('Error fetching data:', error);
      if (error.response && error.response.status === 401) {
        dispatch(logout());
        dispatch(resetCart())
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    getOrders();
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
