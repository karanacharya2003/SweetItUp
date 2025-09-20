// src/pages/ShopPage.jsx
import React, { useState, useEffect } from 'react';
import { getAllSweets, searchSweets, getCategories } from '../api/sweets';
import SweetCard from '../components/SweetCard';
import { useDebounce } from '../hooks/useDebounce';
import { useCache } from '../context/CacheContext.jsx';

const ShopPage = () => {
  const { cacheKey } = useCache();
  const [sweets, setSweets] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [cache, setCache] = useState({});

  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        setCategories(['All', ...response.data]);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    setCache({});
    setCurrentPage(1);
  }, [cacheKey]);

  useEffect(() => {
    const fetchSweetsData = async () => {
      const cacheKey = `${debouncedSearchQuery}-${currentPage}-${selectedCategory}`;
      if (cache[cacheKey]) {
        setSweets(cache[cacheKey].sweets);
        setTotalPages(cache[cacheKey].totalPages);
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        let response;
        const limit = 20;
        
        let queryParams = `name=${debouncedSearchQuery}`;
        if (selectedCategory && selectedCategory !== 'All') {
          queryParams += `&category=${selectedCategory}`;
        }

        response = await searchSweets(queryParams, currentPage, limit);
        
        const sweetsData = response.data.sweets || [];
        const totalPagesData = response.data.totalPages || 1;

        setSweets(sweetsData);
        setTotalPages(totalPagesData);
        setCache(prevCache => ({ ...prevCache, [cacheKey]: { sweets: sweetsData, totalPages: totalPagesData } }));

      } catch (error) {
        console.error("Failed to fetch sweets:", error);
        setSweets([]);
      } finally {
        setLoading(false);
      }
    };
    fetchSweetsData();
  }, [debouncedSearchQuery, currentPage, selectedCategory, cache]);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) setCurrentPage(newPage);
  };
  
  const handleCategoryClick = (category) => {
    setCurrentPage(1);
    setSelectedCategory(category);
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="text-center mb-8">
        <h1 className="text-5xl font-extrabold text-gray-800">Our Collection</h1>
        <p className="text-lg text-gray-600 mt-2">Find your next favorite treat.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-grow">
          <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name..."
              className="w-full pl-10 pr-4 py-3 text-base bg-white border border-gray-200 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          <svg className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
        </div>
        <div className="flex-shrink-0">
          <select 
            value={selectedCategory} 
            onChange={(e) => handleCategoryClick(e.target.value)}
            className="w-full md:w-auto px-4 py-3 text-base bg-white border border-gray-200 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <p className="text-center mt-8 text-gray-600">Loading sweets...</p>
      ) : sweets.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {sweets.map(sweet => <SweetCard key={sweet.id} sweet={sweet} />)}
          </div>
          
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-12 font-bold">
              <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="px-4 py-2 bg-white text-gray-700 rounded-lg shadow-md disabled:opacity-50 hover:bg-gray-100">Prev</button>
              <span className="text-gray-600">Page {currentPage} of {totalPages}</span>
              <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="px-4 py-2 bg-white text-gray-700 rounded-lg shadow-md disabled:opacity-50 hover:bg-gray-100">Next</button>
            </div>
          )}
        </>
      ) : (
        <p className="text-center mt-8 text-gray-600 p-8 bg-white rounded-2xl shadow-md">No sweets found matching your criteria. Try adjusting your search or filters!</p>
      )}
    </div>
  );
};
export default ShopPage;