// src/components/Navbar.jsx
import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
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
    setIsMobileMenuOpen(false);
  };
  
  const linkStyle = "hover:text-teal-500 transition-colors";
  const activeLinkStyle = { color: '#14b8a6', fontWeight: '800' };

  return (
    <nav className="bg-white/80 backdrop-blur-md fixed top-0 left-0 right-0 z-50 border-b border-gray-200 h-20 flex items-center">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-3xl font-extrabold text-gray-800" onClick={() => setIsMobileMenuOpen(false)}>
            Sweetopia
          </Link>

          <div className="hidden md:flex items-center space-x-8 text-gray-700 font-bold">
            <NavLink to="/" className={linkStyle} style={({isActive}) => isActive ? activeLinkStyle : undefined}>Home</NavLink>
            <NavLink to="/shop" className={linkStyle} style={({isActive}) => isActive ? activeLinkStyle : undefined}>Shop</NavLink>
            <NavLink to="/about" className={linkStyle} style={({isActive}) => isActive ? activeLinkStyle : undefined}>About</NavLink>
        {user && user.role === 'admin' && <NavLink to="/admin" className={linkStyle} style={({isActive}) => isActive ? activeLinkStyle : undefined}>Admin</NavLink>}

          </div>

          <div className="hidden md:flex items-center space-x-4">
             <Link to="/cart" className="relative p-2 hover:bg-gray-100 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
              {cartItemCount > 0 && <span className="absolute top-0 right-0 bg-teal-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">{cartItemCount}</span>}
            </Link>
            {user ? (
              <button onClick={handleLogout} className="bg-gray-800 text-white font-bold py-2 px-5 rounded-full hover:bg-gray-700 transition-colors">Logout</button>
            ) : (
              <Link to="/login" className="bg-gray-800 text-white font-bold py-2 px-5 rounded-full hover:bg-gray-700 transition-colors">Login</Link>
            )}
          </div>
          <div className="md:hidden">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}><svg className="w-7 h-7 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg></button>
          </div>
        </div>
      </div>
    </nav>
  );
};
export default Navbar;