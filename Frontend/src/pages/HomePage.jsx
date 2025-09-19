// src/pages/HomePage.jsx
import React, { useState, useEffect } from 'react';
import { getAllSweets, purchaseSweet as purchaseSweetApi } from '../api/sweets';
import SweetCard from '../components/SweetCard';

const HomePage = () => {
  const [sweets, setSweets] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSweets = async () => {
    try {
      const response = await getAllSweets();
      setSweets(response.data);
    } catch (error) {
      console.error("Failed to fetch sweets:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSweets();
  }, []);

  const handlePurchase = async (sweetId) => {
    try {
      // For simplicity, purchasing 1 item at a time
      await purchaseSweetApi(sweetId, 1);
      alert('Purchase successful!');
      fetchSweets(); // Refresh the list of sweets
    } catch (error) {
      alert(error.response?.data?.message || 'Purchase failed.');
    }
  };

  if (loading) return <p className="text-center mt-8">Loading sweets...</p>;

  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Our Sweets Collection</h1>
      {/* Add search and filter inputs here if you want */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {sweets.map(sweet => (
          <SweetCard key={sweet.id} sweet={sweet} onPurchase={handlePurchase} />
        ))}
      </div>
    </div>
  );
};

export default HomePage;