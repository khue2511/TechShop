import React from 'react';
import { CartItem as CartItemType } from '../../types/cartTypes';
import DeleteIcon from '@mui/icons-material/Delete';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../redux/store';
import {
  addToCart,
  clearFromCart,
  removeFromCart,
} from '../../redux/cart/cartSlice';

interface CartItemCardProps {
  item: CartItemType;
}

const CartItemCard: React.FC<CartItemCardProps> = ({ item }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { product, quantity } = item;

  const handleDecreaseQuantity = () => {
    dispatch(removeFromCart(product._id));
  };

  const handleIncreaseQuantity = () => {
    dispatch(addToCart(product._id));
  };

  const handleClearItem = () => {
    dispatch(clearFromCart(product._id));
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between p-4 border-b border-gray-200 hover:bg-gray-100">
      <div>
        <img
          className="flex-shrink-0 w-full h-full sm:w-24 sm:h-24 overflow-hidden rounded-lg"
          src={product.imageUrl}
          alt={product.name}
        />
      </div>
      <div className="flex-1 ml-0 mb-4 sm:mb-0 sm:ml-4">
        <p className="text-sm text-center sm:text-left text-gray-400 mt-1">
          Product ID: {product._id}
        </p>
        <h3 className="text-lg text-center sm:text-left font-semibold">
          {product.name}
        </h3>
        <h3 className="text-lg text-center sm:text-left text-gray-500">
          ${product.price}
        </h3>
      </div>
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="flex items-center gap-x-1">
          <button
            className="border border-gray-400 rounded w-8 h-8"
            onClick={handleDecreaseQuantity}
          >
            -
          </button>
          <span className="w-8 h-8 flex items-center justify-center">
            {quantity}
          </span>
          <button
            className="border border-gray-400 rounded w-8 h-8"
            disabled={quantity === product.quantity}
            onClick={handleIncreaseQuantity}
          >
            +
          </button>
        </div>
        <button
          className="text-red-500 hover:text-red-700"
          onClick={handleClearItem}
        >
          <DeleteIcon />
        </button>
      </div>
    </div>
  );
};

export default CartItemCard;
