import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { Order } from '../../types/orderTypes';
import { RootState } from '../store';
import { logout } from '../auth/authSlice';
import { resetCart } from '../cart/cartSlice';
import axios, { AxiosError } from 'axios';

interface OrderState {
  orders: Order[];
  loading: boolean;
  error: string | null;
}

const initialState: OrderState = {
  orders: [],
  loading: true,
  error: null,
};

const getAuthHeaders = (state: RootState) => ({
  Authorization: `Bearer ${state.auth.accessToken}`,
});
const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async (_, { rejectWithValue, dispatch, getState }) => {
    try {
      const state = getState() as RootState;
      const response = await axios.get(`${apiBaseUrl}/orders`, {
        headers: getAuthHeaders(state),
      });
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response && axiosError.response.status === 401) {
        dispatch(logout());
        dispatch(resetCart());
        dispatch(resetOrders());
      }
      return rejectWithValue(axiosError.response?.data || 'Failed to fetch orders');
    }
  },
);

export const createOrders = createAsyncThunk(
  'orders/createOrders',
  async (
    orderItems: { product: string; quantity: number }[],
    { rejectWithValue, dispatch, getState },
  ) => {
    try {
      const state = getState() as RootState;
      const response = await axios.post(
        `${apiBaseUrl}/orders`,
        { orderItems: orderItems },
        {
          headers: getAuthHeaders(state),
        },
      );
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response && axiosError.response.status === 401) {
        dispatch(logout());
        dispatch(resetCart());
        dispatch(resetOrders());
      }
      return rejectWithValue(axiosError.response?.data || 'Failed to fetch orders');
    }
  },
);

export const updateOrderStatus = createAsyncThunk(
  'orders/updateOrderStatus',
  async (
    { orderId, status }: { orderId: string; status: string },
    { rejectWithValue, dispatch, getState },
  ) => {
    try {
      const state = getState() as RootState;
      const response = await axios.put(
        `${apiBaseUrl}/orders/${orderId}`,
        { status: status },
        {
          headers: getAuthHeaders(state),
        },
      );
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response && axiosError.response.status === 401) {
        dispatch(logout());
        dispatch(resetCart());
        dispatch(resetOrders());
      }
      return rejectWithValue(axiosError.response?.data || 'Failed to fetch orders');
    }
  },
);

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    resetOrders: (state) => {
      state.orders = [];
      state.loading = true;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
        state.error = null;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders.push(action.payload);
        state.error = null;
      })
      .addCase(createOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateOrderStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.loading = false;
        const updatedOrder = action.payload;
        const index = state.orders.findIndex(
          (order) => order._id === updatedOrder._id,
        );
        if (index !== -1) {
          state.orders[index] = updatedOrder;
        }
        state.error = null;
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});
export const { resetOrders } = orderSlice.actions;
export default orderSlice.reducer;
