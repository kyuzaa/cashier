import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('@auth:token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const loginService = {
    login: (data: {username: string; password: string}) => api.post('/login', data)
}

export const dashboardService = {
  getDashboardData: () => api.get('/dashboard'),
};

export const transactionService = {
  getAll: () => api.get('/transactions'),
  search: (params: { nomor_meja?: string; tanggal?: string }) => 
    api.get('/transactions/search', { params }),
  updateStatus: (id: number) => api.put(`/transactions/${id}/status`),
};

export const posService = {
  getCategories: () => api.get('/pos'),
  search: (query: string) => api.get('/pos/search', { params: { query } }),
  checkout: (data: { items: any[]; nomorMeja: string }) => 
    api.post('/checkout', data),
};

export const menuService = {
  getAll: () => api.get('/products'),
  create: (data: FormData) => api.post('/products', data),
  update: (id: number, data: FormData) => api.put(`/products/${id}`, data),
  delete: (id: number) => api.delete(`/products/${id}`),
};