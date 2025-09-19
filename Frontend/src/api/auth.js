// src/api/auth.js
import api from './axiosConfig';

export const register = (userData) => api.post('/auth/register', userData);
export const login = (credentials) => api.post('/auth/login', credentials);