import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartItem } from '../../types/cartTypes';
import axios from 'axios';
import { logout } from '../auth/authSlice';
import { RootState } from '../store';
import { resetOrders } from '../orders/ordersSlice';

interface CartState {
  _id: string | null;
  cartItems: CartItem[];
  totalAmount: number;
  totalQuantity: number;
  loading: boolean;
  error: string | null;
}

const initialState: CartState = {
  _id: null,
  cartItems: [],
  totalAmount: 0,
  totalQuantity: 0,
  loading: true,
  error: null,
};

const getAuthHeaders = (state: RootState) => ({
  Authorization: `Bearer ${state.auth.accessToken}`,
});
const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { rejectWithValue, dispatch, getState }) => {
    try {
      const state = getState() as RootState;
      const response = await axios.get(`${apiBaseUrl}/cart`, {
        headers: getAuthHeaders(state),
      });
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        dispatch(logout());
        dispatch(resetCart());
        dispatch(resetOrders());
      }
      return rejectWithValue(error.response?.data || 'Failed to fetch cart');
    }
  },
);

export const emptyCart = createAsyncThunk(
  'cart/emptyCart',
  async (_, { rejectWithValue, dispatch, getState }) => {
    try {
      const state = getState() as RootState;
      const response = await axios.delete(`${apiBaseUrl}/cart/empty`, {
        headers: getAuthHeaders(state),
      });
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        dispatch(logout());
        dispatch(resetCart());
        dispatch(resetOrders());
      }
      return rejectWithValue(error.response?.data || 'Failed to fetch cart');
    }
  },
);

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async (productId: string, { getState, dispatch, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const response = await axios.post(
        `${apiBaseUrl}/cart/add`,
        { productId, quantity: 1 },
        {
          headers: getAuthHeaders(state),
        },
      );
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        dispatch(logout());
        dispatch(resetCart());
        dispatch(resetOrders());
      }
      return rejectWithValue(error.response?.data);
    }
  },
);

export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async (productId: string, { getState, dispatch, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const response = await axios.delete(
        `${apiBaseUrl}/cart/remove/${productId}`,
        {
          headers: getAuthHeaders(state),
        },
      );
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        dispatch(logout());
        dispatch(resetCart());
        dispatch(resetOrders());
      }
      return rejectWithValue(error.response?.data);
    }
  },
);

export const clearFromCart = createAsyncThunk(
  'cart/clearFromCart',
  async (productId: string, { getState, dispatch, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const response = await axios.delete(
        `${apiBaseUrl}/cart/clear/${productId}`,
        {
          headers: getAuthHeaders(state),
        },
      );
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        dispatch(logout());
        dispatch(resetCart());
        dispatch(resetOrders());
      }
      return rejectWithValue(error.response?.data);
    }
  },
);

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
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state._id = action.payload._id;
        state.cartItems = action.payload.cartItems;
        state.totalAmount = action.payload.totalAmount;
        state.totalQuantity = action.payload.totalQuantity;
        state.error = null;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(emptyCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(emptyCart.fulfilled, (state) => {
        state.loading = false;
        state._id = null;
        state.cartItems = [];
        state.totalAmount = 0;
        state.totalQuantity = 0;
        state.error = null;
      })
      .addCase(emptyCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.cartItems = action.payload.cartItems;
        state.totalAmount = action.payload.totalAmount;
        state.totalQuantity = action.payload.totalQuantity;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.cartItems = action.payload.cartItems;
        state.totalAmount = action.payload.totalAmount;
        state.totalQuantity = action.payload.totalQuantity;
      })
      .addCase(clearFromCart.fulfilled, (state, action) => {
        state.cartItems = action.payload.cartItems;
        state.totalAmount = action.payload.totalAmount;
        state.totalQuantity = action.payload.totalQuantity;
      });
  },
});

export const { setCart, setLoading, resetCart } = cartSlice.actions;

export default cartSlice.reducer;
