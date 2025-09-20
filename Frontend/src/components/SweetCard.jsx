// src/components/SweetCard.jsx
import React, { useState } from 'react';
import { useCart } from '../context/CartContext';

const SweetCard = ({ sweet }) => {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const isOutOfStock = sweet.quantity === 0;

  const handleAddToCart = () => {
    if (quantity <= 0) {
        alert("Please enter a valid quantity.");
        return;
    }
    if (quantity > sweet.quantity) {
      alert(`Only ${sweet.quantity} kg available in stock.`);
      return;
    }
    addToCart(sweet, quantity);
    alert(`${quantity} kg of ${sweet.name} added to cart!`);
    setQuantity(1);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden group flex flex-col transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
      <div className="relative">
        <img 
          src={`https://placehold.co/600x400/a78bfa/ffffff?text=${sweet.name.replace(/\s/g, '+')}&font=nunito`} 
          alt={sweet.name} 
          className="w-full h-56 object-cover"
        />
      </div>
      
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-xl font-extrabold text-gray-800 truncate">{sweet.name}</h3>
        <p className="text-md text-gray-500">{sweet.category}</p>
        <p className="mt-2 text-2xl font-extrabold text-teal-500">₹{sweet.price}<span className="text-base font-bold text-gray-400">/kg</span></p>
        
        <div className="mt-auto pt-4">
          {!isOutOfStock && (
            <div className="flex items-center justify-between mb-4">
              <label htmlFor={`quantity-${sweet.id}`} className="font-bold text-gray-600">Quantity:</label>
              <div className="flex items-center border-2 border-gray-200 rounded-lg">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="px-3 py-1 font-bold text-xl text-gray-600 hover:bg-gray-100 rounded-l-md">-</button>
                <input
                  id={`quantity-${sweet.id}`}
                  type="number"
                  min="1"
                  max={sweet.quantity}
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-16 p-1 border-x-2 border-gray-200 text-center font-bold text-gray-800 focus:outline-none"
                />
                <button onClick={() => setQuantity(q => Math.min(sweet.quantity, q + 1))} className="px-3 py-1 font-bold text-xl text-gray-600 hover:bg-gray-100 rounded-r-md">+</button>
              </div>
            </div>
          )}
           <p className={`text-sm font-bold mb-4 text-center ${isOutOfStock ? 'text-red-500' : 'text-green-600'}`}>
             {isOutOfStock ? 'Out of Stock' : `${sweet.quantity} kg in Stock`}
           </p>
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`w-full font-bold py-3 px-4 rounded-xl transition-all duration-300 text-base shadow-md ${
              isOutOfStock
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-teal-500 text-white hover:bg-teal-600'
            }`}
          >
            {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
};
export default SweetCard;