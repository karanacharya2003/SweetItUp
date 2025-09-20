// src/api/sweets.js
import api from './axiosConfig';

// NOTE: This assumes your backend API now supports pagination.
// Fetches a specific page of sweets.
export const getAllSweets = (page = 1, limit = 20) => api.get(`/sweets?page=${page}&limit=${limit}`);

export const getCategories = () => api.get('/sweets/categories');
// Searches for sweets and fetches a specific page of results.
export const searchSweets = (query, page = 1, limit = 20) => api.get(`/sweets/search?${query}&page=${page}&limit=${limit}`);

// --- The following functions remain the same ---

export const createSweet = (sweetData) => api.post('/sweets', sweetData);

export const updateSweet = (id, sweetData) => api.put(`/sweets/${id}`, sweetData);

export const deleteSweet = (id) => api.delete(`/sweets/${id}`);

export const purchaseSweet = (id, quantity) => api.post(`/sweets/${id}/purchase`, { quantity });

export const restockSweet = (id, quantity) => api.post(`/sweets/${id}/restock`, { quantity });