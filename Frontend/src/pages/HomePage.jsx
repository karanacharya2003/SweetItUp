// src/pages/HomePage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { getAllSweets, searchSweets } from '../api/sweets';
import SweetCard from '../components/SweetCard';
import { useDebounce } from '../hooks/useDebounce';

const HomePage = () => {
  const [sweets, setSweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // New: State for caching fetched pages
  const [cache, setCache] = useState({});

  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const isMounted = useRef(false); // To prevent initial search useEffect from running

  // Main effect for fetching data when page or search query changes
  useEffect(() => {
    const fetchSweetsData = async () => {
      const cacheKey = `${debouncedSearchQuery}-${currentPage}`;
      // 1. Check if the data is already in the cache
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

        if (debouncedSearchQuery.trim()) {
          response = await searchSweets(`name=${debouncedSearchQuery}`, currentPage, limit);
        } else {
          response = await getAllSweets(currentPage, limit);
        }
        
        const sweetsData = Array.isArray(response.data) ? response.data : response.data.sweets;
        const totalPagesData = response.data.totalPages || 1;

        // 2. Update state and save the new data to the cache
        setSweets(Array.isArray(sweetsData) ? sweetsData : []);
        setTotalPages(totalPagesData);
        setCache(prevCache => ({
          ...prevCache,
          [cacheKey]: { sweets: sweetsData, totalPages: totalPagesData }
        }));

      } catch (error) {
        console.error("Failed to fetch sweets:", error);
        setSweets([]);
      } finally {
        setLoading(false);
      }
    };

    // This check prevents an initial double-fetch on component mount
    if (isMounted.current || !searchQuery) {
        fetchSweetsData();
    } else {
        isMounted.current = true;
    }
  }, [debouncedSearchQuery, currentPage, cache]);

  // New: Function to prefetch a page's data
  const prefetchPage = async (pageToFetch) => {
    if (pageToFetch <= 0 || pageToFetch > totalPages) return;

    const cacheKey = `${debouncedSearchQuery}-${pageToFetch}`;
    if (cache[cacheKey]) return; // Don't prefetch if already in cache

    try {
      let response;
      const limit = 20;
      if (debouncedSearchQuery.trim()) {
        response = await searchSweets(`name=${debouncedSearchQuery}`, pageToFetch, limit);
      } else {
        response = await getAllSweets(pageToFetch, limit);
      }
      
      const sweetsData = Array.isArray(response.data) ? response.data : response.data.sweets;
      const totalPagesData = response.data.totalPages || 1;

      // Silently add the prefetched data to the cache
      setCache(prevCache => ({
        ...prevCache,
        [cacheKey]: { sweets: sweetsData, totalPages: totalPagesData }
      }));
    } catch (error) {
      console.error(`Failed to prefetch page ${pageToFetch}:`, error);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
        setCurrentPage(newPage);
    }
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-4xl font-bold text-center mb-4 text-gray-800">Our Sweets Collection</h1>
      
      <div className="max-w-xl mx-auto mb-8">
        <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for a sweet by name..."
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
        />
      </div>

      {loading ? (
        <p className="text-center mt-8">Loading sweets...</p>
      ) : sweets && sweets.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {sweets.map(sweet => <SweetCard key={sweet.id} sweet={sweet} />)}
          </div>
          
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-12">
              <button 
                onClick={() => handlePageChange(currentPage - 1)} 
                onMouseEnter={() => prefetchPage(currentPage - 1)}
                disabled={currentPage === 1} 
                className="px-4 py-2 bg-pink-500 text-white rounded-md disabled:bg-gray-300"
              >
                Previous
              </button>
              <span className="font-semibold">Page {currentPage} of {totalPages}</span>
              <button 
                onClick={() => handlePageChange(currentPage + 1)} 
                onMouseEnter={() => prefetchPage(currentPage + 1)}
                disabled={currentPage === totalPages} 
                className="px-4 py-2 bg-pink-500 text-white rounded-md disabled:bg-gray-300"
              >
                Next
              </button>
            </div>
          )}
        </>
      ) : (
        <p className="text-center mt-8 text-gray-500">No sweets found.</p>
      )}
    </div>
  );
};

export default HomePage;