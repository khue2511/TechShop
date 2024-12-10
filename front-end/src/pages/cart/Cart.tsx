import React, { useEffect, useState } from 'react';
import { Cart as CartType } from '../../types/cartTypes';
import axios, { AxiosResponse } from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import CartItemCard from './CartItemCard';

const Cart: React.FC = () => {
  const [cart, setCart] = useState<CartType>({
    _id: '',
    cartItems: [],
    totalAmount: 0,
    totalQuantity: 0,
    userId: '',
  });
  const [loading, setLoading] = useState<boolean>(true);

  const { accessToken } = useSelector((state: RootState) => state.auth);
  const url = process.env.REACT_APP_API_BASE_URL;
  const getCart = async () => {
    try {
      const response: AxiosResponse = await axios.get(`${url}/cart`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setCart(response.data);
      console.log(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getCart();
  }, []);

  return (
    <div className="container mx-auto my-4 p-4 border rounded-md shadow-lg">
      <h1 className="text-2xl font-bold mb-4">Shopping Cart</h1>
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <div className="spinner-border animate-spin inline-block w-16 h-16 border-4 border-solid border-gray-200 border-t-gray-500 rounded-full" />
        </div>
      ) : cart.cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div>
          {cart.cartItems.map((item) => (
            <CartItemCard
              key={item.product._id}
              item={item}
            />
          ))}
          <div className="text-right">
            <h2 className="text-xl font-bold mt-4">
              Total Amount: ${cart.totalAmount}
            </h2>
          </div>
          <button className="block ml-auto mt-4 px-4 py-2 border bg-black text-white hover:bg-white hover:text-black transition duration-100">
            Place Order
          </button>
        </div>
      )}
    </div>
  );
};

export default Cart;
