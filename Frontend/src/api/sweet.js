// src/api/sweets.js
import api from './axiosConfig';

export const getAllSweets = () => api.get('/sweets');
export const searchSweets = (query) => api.get(`/sweets/search?${query}`);
export const createSweet = (sweetData) => api.post('/sweets', sweetData);
export const updateSweet = (id, sweetData) => api.put(`/sweets/${id}`, sweetData);
export const deleteSweet = (id) => api.delete(`/sweets/${id}`);
export const purchaseSweet = (id, quantity) => api.post(`/sweets/${id}/purchase`, { quantity });
export const restockSweet = (id, quantity) => api.post(`/sweets/${id}/restock`, { quantity });