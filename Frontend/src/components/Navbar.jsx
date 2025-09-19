// src/components/Navbar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-pink-600 text-white shadow-md">
      <div className="container mx-auto px-6 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">Sweet Shop</Link>
        <div>
          {user ? (
            <>
              <span className="mr-4">Welcome, {user.name}!</span>
              {user.role === 'admin' && <Link to="/admin" className="mr-4 hover:text-pink-200">Admin</Link>}
              <button onClick={handleLogout} className="bg-white text-pink-600 font-semibold py-2 px-4 rounded hover:bg-pink-100">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="mr-4 hover:text-pink-200">Login</Link>
              <Link to="/register" className="hover:text-pink-200">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;