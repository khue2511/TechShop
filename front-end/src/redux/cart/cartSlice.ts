import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartItem } from '../../types/cartTypes';

interface CartState {
  _id: string | null;
  cartItems: CartItem[];
  totalAmount: number;
  totalQuantity: number;
  loading: boolean;
}

const initialState: CartState = {
  _id: null,
  cartItems: [],
  totalAmount: 0,
  totalQuantity: 0,
  loading: true,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCart: (state, action: PayloadAction<CartState>) => {
      state._id = action.payload._id;
      state.cartItems = action.payload.cartItems;
      state.totalAmount = action.payload.totalAmount;
      state.totalQuantity = action.payload.totalQuantity;
      state.loading = false;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    resetCart: (state) => {
      state._id = null;
      state.cartItems = [];
      state.totalAmount = 0;
      state.totalQuantity = 0;
      state.loading = true;
    }
  },
});

export const { setCart, setLoading } = cartSlice.actions;

export default cartSlice.reducer;
