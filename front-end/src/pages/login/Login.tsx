import axios, { AxiosResponse } from 'axios';
import React, { useEffect, useState } from 'react';
import { AppDispatch, RootState } from '../../redux/store';
import { useDispatch, useSelector } from 'react-redux';
import {
  loginStart,
  loginSuccess,
  loginFailure,
  resetError,
} from '../../redux/auth/authSlice';
import { User } from '../../types/userTypes';
import LoginIcon from '@mui/icons-material/Login';
import { fetchCart } from '../../redux/cart/cartSlice';
import { fetchOrders } from '../../redux/orders/ordersSlice';

function Login() {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const dispatch = useDispatch<AppDispatch>();
  const {
    userInfo,
    isAuthenticated,
    loading,
    error,
    // accessToken,
    // refreshToken
  } = useSelector((state: RootState) => state.auth);
  const url = process.env.REACT_APP_API_BASE_URL as string;

  useEffect(() => {
    if (!isAuthenticated) {
      dispatch(resetError());
    }
  }, [dispatch, isAuthenticated]);

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(loginStart());
    try {
      const response: AxiosResponse<User> = await axios.post(`${url}/auth/login`, {
        username,
        password,
      });
      const data = response.data;
      dispatch(loginSuccess(data));
      dispatch(fetchCart())
      dispatch(fetchOrders())
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data.message ||
          error.message ||
          'An error occurred';
        dispatch(loginFailure(errorMessage));
      } else {
        dispatch(loginFailure('An unknown error occurred.'));
      }
    }
  };

  return (
    <div className="login-container flex flex-col items-center h-screen">
      {!isAuthenticated ? (
        <form
          onSubmit={login}
          className="login-box flex flex-col items-center gap-y-2 mt-24 p-8 w-80 border border-neutral-400 xs:w-96"
        >
          <h1 className="text-3xl font-bold text-center">Log in to TechShop</h1>
          <p>Enter your details below</p>
          <input
            className="w-full h-12 mt-6 p-4 border border-neutral-400"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            className="w-full h-12 p-4 border border-neutral-400"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <p className="mt-2 text-rose-600">{error}</p>
          <button
            className={`mt-4 py-2 px-4 text-white ${loading ? 'bg-gray-500' : 'bg-black'}`}
          >
            {loading ? (
              'LOGGING IN...'
            ) : (
              <>
                LOGIN <LoginIcon />
              </>
            )}
          </button>
        </form>
      ) : (
        <h1 className="text-3xl mt-8">
          You are currently logged in as <b>{userInfo?.username}!</b>
        </h1>
      )}
    </div>
  );
}

export default Login;
