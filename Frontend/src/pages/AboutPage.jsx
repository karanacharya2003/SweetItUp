// src/pages/AboutPage.jsx
import React from 'react';

const AboutPage = () => {
  return (
    <div className="container mx-auto px-6 py-16">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-5xl font-extrabold text-gray-800">Our Story</h1>
        <p className="mt-6 text-lg text-gray-600">
          Founded in 2025, Sweet Shop was born from a simple passion: to create the most delightful and high-quality sweets that bring a smile to everyone's face. We believe in tradition, but we aren't afraid to innovate, blending timeless recipes with modern flavors.
        </p>
      </div>
      <div className="mt-16 grid md:grid-cols-2 gap-12 items-center">
        <div className="text-gray-700 space-y-4">
          <h2 className="text-3xl font-bold text-teal-600">Our Mission</h2>
          <p>To craft moments of joy through our sweets, using only the best, ethically sourced ingredients. We're committed to quality, community, and the simple happiness that a perfect sweet can bring.</p>
          <h2 className="text-3xl font-bold text-teal-600 mt-8">Our Ingredients</h2>
          <p>From rich, creamy milk to exotic spices and pure cane sugar, every ingredient is chosen with care. We partner with local producers whenever possible to ensure freshness and support our community.</p>
        </div>
        <div>
          <img src="https://placehold.co/600x400/14b8a6/ffffff?text=Our+Kitchen&font=nunito" alt="Our Kitchen" className="rounded-2xl shadow-xl w-full"/>
        </div>
      </div>
    </div>
  );
};
export default AboutPage;