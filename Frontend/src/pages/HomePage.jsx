// src/pages/HomePage.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="container mx-auto px-6 py-16 text-center">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-extrabold text-gray-800 leading-tight">
          Handcrafted Happiness, <br/>
          <span className="text-teal-500">Delivered.</span>
        </h1>
        <p className="mt-6 text-lg text-gray-600">
          Artisan sweets for discerning palates. Explore our collection of delightful treats, made with love and the finest ingredients.
        </p>
        <Link 
          to="/shop" 
          className="mt-8 inline-block bg-teal-500 text-white font-bold text-lg py-4 px-10 rounded-full shadow-lg hover:bg-teal-600 transition-all duration-300 transform hover:scale-105"
        >
          Shop Now
        </Link>
      </div>
    </div>
  );
};
export default HomePage;