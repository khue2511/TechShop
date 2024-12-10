import { IconButton } from '@mui/material';
import React from 'react';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';

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
        <span className='text-xs text-gray-400'>ID: {_id}</span>
          <p className="text-3xl font-bold">${price}</p>
          <h3 className="text-xl font-bold">{name}</h3>
          <p>{description}</p>
        </div>
        <div className="flex flex-row justify-between items-center pt-4">
          <p className="text-sm">Quantity: {quantity}</p>
          <IconButton
            color="primary"
            aria-label="add to shopping cart"
          >
            <AddShoppingCartIcon />
          </IconButton>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
