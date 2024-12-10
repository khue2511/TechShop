import React from 'react';
import { CartItem as CartItemType } from '../../types/cartTypes';
import DeleteIcon from '@mui/icons-material/Delete';

interface CartItemCardProps {
  item: CartItemType;
}

const CartItemCard: React.FC<CartItemCardProps> = ({ item }) => {
  const { product, quantity } = item;
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between p-4 border-b border-gray-200 hover:bg-gray-100">
      {/* Product image */}
      <div>
        <img
          className="flex-shrink-0 w-full h-full sm:w-24 sm:h-24 overflow-hidden rounded-lg"
          src={product.imageUrl}
          alt={product.name}
        />
      </div>

      {/* Product Details */}
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
      {/* Quantity Controls and Delete Button */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="flex items-center gap-x-1">
          <button className="border border-gray-400 rounded w-8 h-8 disabled:cursor-not-allowed">
            -
          </button>
          <span className="w-8 h-8 flex items-center justify-center">
            {quantity}
          </span>
          <button
            className="border border-gray-400 rounded w-8 h-8 disabled:cursor-not-allowed disabled:text-gray-300 disabled:border-gray-300"
            disabled={quantity === product.quantity}
          >
            +
          </button>
        </div>
        <button className="text-red-500 hover:text-red-700">
          <DeleteIcon />
        </button>
      </div>
    </div>
  );
};

export default CartItemCard;
