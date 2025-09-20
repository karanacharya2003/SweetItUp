// src/context/CacheContext.jsx
import React, { createContext, useState, useContext } from 'react';

const CacheContext = createContext();

export const useCache = () => useContext(CacheContext);

export const CacheProvider = ({ children }) => {
  const [cacheKey, setCacheKey] = useState(0);

  const invalidateCache = () => {
    setCacheKey(prevKey => prevKey + 1);
  };

  const value = {
    cacheKey,
    invalidateCache,
  };

  return <CacheContext.Provider value={value}>{children}</CacheContext.Provider>;
};