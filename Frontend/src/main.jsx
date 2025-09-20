// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { AuthProvider } from './context/AuthContext.jsx';
import { CartProvider } from './context/CartContext.jsx';
import { CacheProvider } from './context/CacheContext.jsx';


import { Toaster } from 'react-hot-toast'; // Import the Toaster
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <CartProvider>
        <CacheProvider>
          <App />
          <Toaster // Add this component here
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#333',
                color: '#fff',
              },
            }}
          />
        </CacheProvider>
      </CartProvider>
    </AuthProvider>
  </React.StrictMode>
);