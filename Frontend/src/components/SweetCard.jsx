// src/components/SweetCard.jsx
import React from 'react';

const SweetCard = ({ sweet, onPurchase }) => {
  const isOutOfStock = sweet.quantity === 0;

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300">
      <div className="p-6">
        <h3 className="text-2xl font-bold text-pink-800 mb-2">{sweet.name}</h3>
        <p className="text-gray-600 mb-1"><span className="font-semibold">Category:</span> {sweet.category}</p>
        <p className="text-gray-600 mb-1"><span className="font-semibold">Price:</span> ₹{sweet.price}</p>
        <p className="text-gray-600 mb-4"><span className="font-semibold">In Stock:</span> {sweet.quantity}</p>
        <button
          onClick={() => onPurchase(sweet.id)}
          disabled={isOutOfStock}
          className={`w-full font-bold py-2 px-4 rounded transition-colors duration-300 ${
            isOutOfStock
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-pink-500 text-white hover:bg-pink-700'
          }`}
        >
          {isOutOfStock ? 'Out of Stock' : 'Purchase'}
        </button>
      </div>
    </div>
  );
};

export default SweetCard;