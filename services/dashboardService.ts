import { API_BASE_URL, getAuthHeader, safeFetch } from './apiConfig';

const API_URL = `${API_BASE_URL}/dashboard`;

export const dashboardService = {
  async getStats() {
    try {
      const res = await safeFetch(`${API_URL}/stats`, { headers: getAuthHeader('admin') });
      return await res.json();
    } catch (error) {
       console.warn('Dashboard stats API unreachable');
       return {
         revenue: { value: 0, trend: 0 },
         orders: { value: 0, trend: 0 },
         customers: { value: 0, trend: 0 },
         products: { value: 0, trend: 0 }
       };
    }
  },

  async getCharts(period = '7days') {
    try {
      const res = await safeFetch(`${API_URL}/charts?period=${period}`, { headers: getAuthHeader('admin') });
      return await res.json();
    } catch (error) {
      console.warn('Dashboard charts API unreachable');
      return { sales: [], categories: [] };
    }
  },

  async getRecentOrders() {
    try {
      const res = await safeFetch(`${API_URL}/recent-orders`, { headers: getAuthHeader('admin') });
      return await res.json();
    } catch (error) {
      return [];
    }
  },

  async getTopProducts() {
    try {
      const res = await safeFetch(`${API_URL}/top-products`, { headers: getAuthHeader('admin') });
      return await res.json();
    } catch (error) {
      return [];
    }
  },

  async getLowStock() {
    try {
      const res = await safeFetch(`${API_URL}/low-stock`, { headers: getAuthHeader('admin') });
      return await res.json();
    } catch (error) {
      return [];
    }
  }
};