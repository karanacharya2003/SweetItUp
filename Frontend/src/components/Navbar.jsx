// src/components/Navbar.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMobileMenuOpen(false); // Close menu on logout
  };

  return (
    <nav className="bg-pink-600 text-white shadow-md sticky top-0 z-40">
      <div className="container mx-auto px-6 py-3">
        <div className="flex justify-between items-center">
          {/* Brand */}
          <Link to="/" className="text-2xl font-bold" onClick={() => setIsMobileMenuOpen(false)}>
            Sweet Shop
          </Link>

          {/* Hamburger Menu Button (visible on mobile) */}
          <div className="md:hidden">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}></path>
              </svg>
            </button>
          </div>

          {/* Desktop Menu (visible on medium screens and up) */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/cart" className="relative hover:text-pink-200 p-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
              {cartItemCount > 0 && <span className="absolute -top-1 -right-1 bg-white text-pink-600 text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">{cartItemCount}</span>}
            </Link>
            
            {user ? (
              <>
                <span className="font-semibold">Welcome, {user?.name || 'User'}!</span>
                {user.role === 'admin' && <Link to="/admin" className="hover:text-pink-200">Admin</Link>}
                <button onClick={handleLogout} className="bg-white text-pink-600 font-semibold py-2 px-4 rounded hover:bg-pink-100 transition-colors">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-pink-200">Login</Link>
                <Link to="/register" className="hover:text-pink-200">Register</Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile Menu (conditionally rendered) */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4">
            <div className="flex flex-col items-start space-y-4">
              <Link to="/cart" className="hover:text-pink-200 block w-full relative" onClick={() => setIsMobileMenuOpen(false)}>
                Cart
                {cartItemCount > 0 && <span className="ml-2 bg-white text-pink-600 text-xs rounded-full h-5 w-5 inline-flex items-center justify-center font-bold">{cartItemCount}</span>}
              </Link>
              
              {user ? (
                <>
                  {user.role === 'admin' && <Link to="/admin" className="hover:text-pink-200 block w-full" onClick={() => setIsMobileMenuOpen(false)}>Admin Panel</Link>}
                  <button onClick={handleLogout} className="bg-white text-pink-600 font-semibold py-2 px-4 rounded hover:bg-pink-100 w-full text-left transition-colors">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="hover:text-pink-200 block w-full" onClick={() => setIsMobileMenuOpen(false)}>Login</Link>
                  <Link to="/register" className="hover:text-pink-200 block w-full" onClick={() => setIsMobileMenuOpen(false)}>Register</Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;