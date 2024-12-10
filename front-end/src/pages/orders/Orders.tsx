import axios, { AxiosResponse } from 'axios';
import React, { useEffect, useState } from 'react';
import { Order } from '../../types/orderTypes';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

const Orders: React.FC = () => {
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
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getOrders();
  }, [accessToken]);

  return (
    <div>
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
              {orders.map((order) => {
                console.log(order.orderItems);
                return (
                  <div key={order.id}>
                    <p>{order.userId}</p>
                    <p>{order.totalAmount}</p>
                    <p>{order.totalQuantity}</p>
                    <p>{order.status}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Orders;
