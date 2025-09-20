// src/components/SweetCard.jsx
import React, { useState } from 'react';
import { useCart } from '../context/CartContext';

const SweetCard = ({ sweet }) => {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const isOutOfStock = sweet.quantity === 0;

  const handleAddToCart = () => {
    if (quantity > sweet.quantity) {
      alert(`Only ${sweet.quantity} kg available in stock.`);
      return;
    }
    addToCart(sweet, quantity);
    alert(`${quantity} kg of ${sweet.name} added to cart!`);
    setQuantity(1); // Reset quantity after adding
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300 flex flex-col">
      <img 
        src={`https://placehold.co/600x400/F472B6/FFFFFF?text=${sweet.name}`} 
        alt={sweet.name} 
        className="w-full h-48 object-cover"
      />
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-2xl font-bold text-pink-800 mb-2">{sweet.name}</h3>
        <p className="text-gray-600 mb-1"><span className="font-semibold">Category:</span> {sweet.category}</p>
        <p className="text-2xl font-bold text-gray-800 my-2">₹{sweet.price}<span className="text-base font-normal">/kg</span></p>
        <p className={`font-semibold mb-4 ${isOutOfStock ? 'text-red-500' : 'text-green-600'}`}>
          {isOutOfStock ? 'Out of Stock' : `${sweet.quantity} kg in Stock`}
        </p>

        <div className="mt-auto">
          {!isOutOfStock && (
            <div className="flex items-center gap-4 mb-4">
              <label htmlFor={`quantity-${sweet.id}`} className="font-semibold">Qty (kg):</label>
              <input
                id={`quantity-${sweet.id}`}
                type="number"
                min="1"
                max={sweet.quantity}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-20 p-2 border border-gray-300 rounded-md"
              />
            </div>
          )}
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`w-full font-bold py-3 px-4 rounded transition-colors duration-300 text-lg ${
              isOutOfStock
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-pink-500 text-white hover:bg-pink-700'
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