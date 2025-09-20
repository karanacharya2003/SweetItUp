// src/pages/HomePage.jsx
import React, { useState, useEffect } from 'react';
import { getAllSweets, purchaseSweet as purchaseSweetApi, searchSweets } from '../api/sweets';
import SweetCard from '../components/SweetCard';

const HomePage = () => {
  const [sweets, setSweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

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
    // If search is cleared, fetch all sweets, otherwise don't fetch automatically
    if (!searchQuery) {
        fetchSweets();
    }
  }, [searchQuery]);

  const handlePurchase = async (sweetId) => {
    try {
      // For simplicity, purchasing 1 item at a time
      await purchaseSweetApi(sweetId, 1);
      alert('Purchase successful!');
      // Refetch the list of sweets to show updated quantity
      searchQuery ? handleSearch() : fetchSweets();
    } catch (error) {
      alert(error.response?.data?.message || 'Purchase failed.');
    }
  };

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) {
        fetchSweets();
        return;
    }
    setLoading(true);
    try {
        const response = await searchSweets(`name=${searchQuery}`);
        setSweets(response.data);
    } catch (error) {
        console.error("Failed to search sweets:", error);
        setSweets([]); // Clear sweets on search error
    } finally {
        setLoading(false);
    }
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-4xl font-bold text-center mb-4 text-gray-800">Our Sweets Collection</h1>
      
      {/* Search Form */}
      <form onSubmit={handleSearch} className="max-w-xl mx-auto mb-8 flex gap-2">
        <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for a sweet by name..."
            className="flex-grow px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
        />
        <button type="submit" className="px-6 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 shadow-md">
            Search
        </button>
      </form>

      {/* Sweets Grid */}
      {loading ? (
        <p className="text-center mt-8">Loading sweets...</p>
      ) : sweets.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {sweets.map(sweet => (
            <SweetCard key={sweet.id} sweet={sweet} onPurchase={handlePurchase} />
          ))}
        </div>
      ) : (
        <p className="text-center mt-8 text-gray-500">No sweets found. Try a different search or clear the search bar.</p>
      )}
    </div>
  );
};

export default HomePage;