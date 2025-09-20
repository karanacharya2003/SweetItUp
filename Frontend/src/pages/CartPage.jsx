// src/pages/CartPage.jsx
import React from 'react';
import { useCart } from '../context/CartContext';
import { purchaseSweet as purchaseSweetApi } from '../api/sweets';
import { useNavigate } from 'react-router-dom';

const CartPage = () => {
  const { cartItems, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty.");
      return;
    }
    
    try {
      // In a real app, you would have a single checkout endpoint.
      // Here, we simulate by calling purchase for each item.
      for (const item of cartItems) {
        await purchaseSweetApi(item.id, item.quantity);
      }
      alert('Checkout successful! Your order has been placed.');
      clearCart();
      navigate('/'); // Redirect to home page
    } catch (error) {
      console.error("Checkout failed:", error);
      alert(error.response?.data?.message || 'An error occurred during checkout.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Your Shopping Cart</h1>
      {cartItems.length === 0 ? (
        <p className="text-center text-gray-500">Your cart is empty.</p>
      ) : (
        <div className="max-w-4xl mx-auto">
          <div className="bg-white shadow-md rounded-lg p-6">
            {cartItems.map(item => (
              <div key={item.id} className="flex items-center justify-between py-4 border-b">
                <div>
                  <h2 className="text-xl font-semibold">{item.name}</h2>
                  <p className="text-gray-600">
                    {item.quantity} kg @ ₹{item.price}/kg
                  </p>
                </div>
                <div className="flex items-center gap-4">
                   <p className="text-lg font-bold">₹{(item.price * item.quantity).toFixed(2)}</p>
                   <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-700">Remove</button>
                </div>
              </div>
            ))}
            <div className="flex justify-end items-center mt-6">
              <span className="text-2xl font-bold">Total: ₹{total}</span>
            </div>
            <div className="flex justify-end mt-4 gap-4">
              <button onClick={clearCart} className="px-6 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400">Clear Cart</button>
              <button onClick={handleCheckout} className="px-6 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700">
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;