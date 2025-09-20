// src/context/AuthContext.jsx
import React, { createContext, useState } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext(null);

// This function runs immediately to get the initial user state
const getInitialUser = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    return null;
  }
  try {
    // Decode the token to get user data
    return jwtDecode(token);
  } catch (error) {
    // If token is invalid, remove it
    console.error("Invalid token found:", error);
    localStorage.removeItem('token');
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  // Initialize user state by calling the function above
  const [user, setUser] = useState(getInitialUser());
  const [token, setToken] = useState(localStorage.getItem('token'));

  const login = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    const decodedUser = jwtDecode(newToken);
    setUser(decodedUser);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;