export const BASE_URL = 'https://your-api-domain.com/api';

export const Endpoints = {
  // Auth Endpoints
  AUTH: {
    LOGIN: `${BASE_URL}/login`,
    LOGOUT: `${BASE_URL}/logout`,
    REGISTER: `${BASE_URL}/register`,
    REFRESH_TOKEN: `${BASE_URL}/refresh-token`,
  },

  // Product Endpoints
  PRODUCTS: {
    LIST: `${BASE_URL}/products`,
    DETAIL: (id: number) => `${BASE_URL}/products/${id}`,
    CREATE: `${BASE_URL}/products`,
    UPDATE: (id: number) => `${BASE_URL}/products/${id}`,
    DELETE: (id: number) => `${BASE_URL}/products/${id}`,
    SEARCH: `${BASE_URL}/products/search`,
  },

  // Category Endpoints
  CATEGORIES: {
    LIST: `${BASE_URL}/categories`,
    DETAIL: (id: number) => `${BASE_URL}/categories/${id}`,
    CREATE: `${BASE_URL}/categories`,
    UPDATE: (id: number) => `${BASE_URL}/categories/${id}`,
    DELETE: (id: number) => `${BASE_URL}/categories/${id}`,
  },

  // Transaction Endpoints
  TRANSACTIONS: {
    LIST: `${BASE_URL}/transactions`,
    DETAIL: (id: number) => `${BASE_URL}/transactions/${id}`,
    CREATE: `${BASE_URL}/transactions`,
    UPDATE_STATUS: (id: number) => `${BASE_URL}/transactions/${id}/status`,
    SEARCH: `${BASE_URL}/transactions/search`,
  },

  // POS Endpoints
  POS: {
    CATEGORIES: `${BASE_URL}/pos/categories`,
    PRODUCTS: `${BASE_URL}/pos/products`,
    RESET: `${BASE_URL}/pos/reset`,
  },

  // Dashboard/Stats Endpoints
  STATS: {
    SUMMARY: `${BASE_URL}/stats/summary`,
    SALES: `${BASE_URL}/stats/sales`,
    TRANSACTIONS: `${BASE_URL}/stats/transactions`,
    PRODUCTS: `${BASE_URL}/stats/products`,
  },

  // Upload Endpoint
  UPLOAD: {
    IMAGE: `${BASE_URL}/upload/image`,
  }
};

export const getHeaders = (token?: string) => {
  const headers: Record<string, string> = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};

export const handleApiError = (error: any) => {
  if (error.response) {
    // Server responded with error
    return error.response.data.message || 'Server error occurred';
  } else if (error.request) {
    // Request made but no response
    return 'No response from server';
  } else {
    // Error setting up request
    return 'Error making request';
  }
};