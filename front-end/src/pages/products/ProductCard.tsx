import { IconButton } from '@mui/material';
import React from 'react';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import { addToCart, removeFromCart } from '../../redux/cart/cartSlice';

interface ProductCardProps {
  _id: string;
  name: string;
  quantity: number;
  price: number;
  description: string;
  imageUrl: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  _id,
  name,
  quantity,
  price,
  description,
  imageUrl,
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const cartItems = useSelector((state: RootState) => state.cart.cartItems);
  const cartItem = cartItems.find((item) => item.product._id === _id);
  const isInCart = cartItems.some((item) => item.product._id === _id);

  const handleAddToCart = () => {
    dispatch(addToCart(_id))
  }
  const handleDecreaseQuantity = () => {
    dispatch(removeFromCart(_id));
  };

  return (
    <div className="product-card flex flex-col border max-w-72 rounded-md shadow-lg p-4">
      <div className="">
        <img
          className="w-full h-auto"
          src={imageUrl}
          alt={name}
        ></img>
      </div>
      <div className="flex flex-col justify-between mt-1 gap-y-1 h-full">
        <div>
          <span className="text-xs text-gray-400">ID: {_id}</span>
          <p className="text-3xl font-bold">${price}</p>
          <h3 className="text-xl font-bold">{name}</h3>
          <p>{description}</p>
        </div>
        <div className="flex flex-row justify-between items-center pt-4">
          <p className="text-sm">Quantity: {quantity}</p>
          {isInCart ? (
            <div className="flex items-center gap-x-1">
              <button
                className="border border-gray-400 rounded w-7 h-7"
                onClick={handleDecreaseQuantity}
              >
                -
              </button>
              <span className="w-7 h-7 text-center">{cartItem?.quantity}</span>
              <button
                className="border border-gray-400 rounded w-7 h-7 disabled:cursor-not-allowed disabled:text-gray-300 disabled:border-gray-300"
                disabled={quantity === cartItem?.quantity}
                onClick={handleAddToCart}
              >
                +
              </button>
            </div>
          ) : (
            <IconButton
              color="primary"
              aria-label="add to shopping cart"
              onClick={handleAddToCart}
            >
              <AddShoppingCartIcon />
            </IconButton>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
