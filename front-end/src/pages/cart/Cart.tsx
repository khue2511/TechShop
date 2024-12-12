import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import CartItemCard from './CartItemCard';
import { useDispatch } from 'react-redux';
import { fetchCart } from '../../redux/cart/cartSlice';

const Cart: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { cartItems, totalAmount, loading } = useSelector(
    (state: RootState) => state.cart,
  );

  useEffect(() => {
    dispatch(fetchCart());
  }, []);

  return (
    <div className="container mx-auto my-4 p-4 border rounded-md shadow-lg">
      <h1 className="text-2xl font-bold mb-4">Shopping Cart</h1>
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <div className="spinner-border animate-spin inline-block w-16 h-16 border-4 border-solid border-gray-200 border-t-gray-500 rounded-full" />
        </div>
      ) : cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div>
          {cartItems.map((item) => (
            <CartItemCard
              key={item.product._id}
              item={item}
            />
          ))}
          <div className="text-right">
            <h2 className="text-xl font-bold mt-4">
              Total Amount: ${totalAmount}
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
