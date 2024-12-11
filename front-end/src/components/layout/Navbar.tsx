import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import StoreIcon from '@mui/icons-material/Store';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import DevicesIcon from '@mui/icons-material/Devices';
import MenuIcon from '@mui/icons-material/Menu';
import ReceiptIcon from '@mui/icons-material/Receipt';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../redux/auth/authSlice';
import { RootState } from '../../redux/store';

function Navbar() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated,
  );
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const location = useLocation();

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className="navbar flex flex-col sm:flex-row gap-y-8 sm:items-center justify-between border">
      <div className="flex justify-between">
        <Link
          to="/"
          className="text-3xl font-bold hover:text-sky-700 cursor-pointer drop-shadow-lg m-8"
        >
          TechShop <DevicesIcon />
        </Link>
        <button
          className="block sm:hidden m-8"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <MenuIcon />{' '}
        </button>
      </div>
      <div
        className={`${menuOpen ? 'absolute top-25 left-0 right-0 bg-white border z-10 py-8' : 'hidden'}
        sm:flex sm:static sm:visible flex-col sm:flex-row sm:items-center sm:gap-x-6 sm:border-none sm:p-0 sm:w-fit sm:m-8 sm:py-0`}
      >
        {!isAuthenticated ? (
          <>
            <Link
              to="/login"
              className="flex flex-col items-center p-2 hover:text-sky-700 cursor-pointer"
            >
              <LoginIcon />
              <p>Login</p>
            </Link>
          </>
        ) : (
          <>
            <Link
              to="/products"
              className="flex flex-col items-center p-2 hover:text-sky-700 cursor-pointer"
            >
              <StoreIcon />
              <p>Products</p>
            </Link>
            <Link
              to="/orders"
              className="flex flex-col items-center p-2 hover:text-sky-700 cursor-pointer"
            >
              <ReceiptIcon />
              <p>Your Orders</p>
            </Link>
            <Link
              to="/cart"
              className="flex flex-col items-center p-2 hover:text-sky-700 cursor-pointer"
            >
              <ShoppingCartIcon />
              <p>Cart</p>
            </Link>
            <button
              className="flex flex-col items-center p-2 hover:text-sky-700 cursor-pointer w-full sm:w-fit"
              onClick={handleLogout}
            >
              <LogoutIcon />
              <p>Log out</p>
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default Navbar;
