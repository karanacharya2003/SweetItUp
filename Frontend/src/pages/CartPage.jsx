// src/pages/CartPage.jsx
import React from 'react';
import { useCart } from '../context/CartContext';
import { purchaseSweet as purchaseSweetApi } from '../api/sweets';
import { useNavigate, Link } from 'react-router-dom';

const CartPage = () => {
  const { cartItems, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty.");
      return;
    }
    
    try {
      // This simulates a checkout by purchasing each item individually
      for (const item of cartItems) {
        await purchaseSweetApi(item.id, item.quantity);
      }
      alert('Checkout successful! Your order has been placed.');
      clearCart();
      navigate('/shop');
    } catch (error) {
      console.error("Checkout failed:", error);
      alert(error.response?.data?.message || 'An error occurred during checkout.');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-6 py-16 text-center">
        <div className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-lg">
          <h1 className="text-4xl font-extrabold text-gray-800">Your Cart is Empty</h1>
          <p className="mt-4 text-gray-600">Looks like you haven't added any sweets yet. Let's fix that!</p>
          <Link 
            to="/shop" 
            className="mt-6 inline-block bg-teal-500 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-teal-600 transition-transform transform hover:scale-105"
          >
            Explore Sweets
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-extrabold text-gray-800">Review Your Cart</h1>
      </div>

      <div className="grid lg:grid-cols-3 gap-12">
        {/* Cart Items List */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6 space-y-4">
          {cartItems.map(item => (
            <div key={item.id} className="flex items-center justify-between py-4 border-b border-gray-200">
              <div className="flex items-center gap-4">
                <img 
                  src={`https://placehold.co/100x100/a78bfa/ffffff?text=${item.name.replace(/\s/g, '+')}`} 
                  alt={item.name} 
                  className="rounded-lg w-16 h-16 object-cover" 
                />
                <div>
                  <h2 className="text-lg font-bold text-gray-800">{item.name}</h2>
                  <p className="text-sm text-gray-500">
                    {item.quantity} kg @ ₹{item.price}/kg
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                 <p className="text-lg font-bold text-gray-900">₹{(item.price * item.quantity).toFixed(2)}</p>
                 <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-700 font-semibold text-sm">Remove</button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-28">
            <h2 className="text-2xl font-extrabold text-gray-800 border-b pb-4">Order Summary</h2>
            <div className="space-y-4 my-4">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>Free</span>
              </div>
            </div>
            <div className="flex justify-between text-xl font-bold text-gray-900 border-t pt-4">
              <span>Total</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <button 
              onClick={handleCheckout} 
              className="mt-6 w-full bg-teal-500 text-white font-bold text-lg py-3 px-6 rounded-full shadow-lg hover:bg-teal-600 transition-transform transform hover:scale-105"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CartPage;