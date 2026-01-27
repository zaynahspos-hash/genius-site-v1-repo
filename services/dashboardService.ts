import { API_BASE_URL, getAuthHeader } from './apiConfig';
import { db } from './dbService';

const API_URL = `${API_BASE_URL}/dashboard`;

// Helper to fetch with a strict timeout
const fetchWithTimeout = async (url: string, options: any = {}, timeout = 1000) => {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    try {
        const response = await fetch(url, { ...options, signal: controller.signal });
        clearTimeout(id);
        return response;
    } catch (error) {
        clearTimeout(id);
        throw error;
    }
};

export const dashboardService = {
  async getStats() {
    try {
      const res = await fetchWithTimeout(`${API_URL}/stats`, { headers: getAuthHeader('admin') });
      if (!res.ok) throw new Error('Failed to fetch stats');
      return await res.json();
    } catch (error) {
       // Fallback to local DB
       const stats = db.getStats();
       return {
         revenue: { value: stats.totalSales, trend: 12.5 },
         orders: { value: stats.totalOrders, trend: 8.2 },
         customers: { value: 12, trend: 5.4 }, // Mock customer count
         products: { value: stats.totalProducts, trend: 0 }
       };
    }
  },

  async getCharts(period = '7days') {
    try {
      const res = await fetchWithTimeout(`${API_URL}/charts?period=${period}`, { headers: getAuthHeader('admin') });
      if (!res.ok) throw new Error('Failed to fetch charts');
      return await res.json();
    } catch (error) {
      // Mock Chart Data
      return { 
        sales: [
            { date: 'Mon', sales: 4000, orders: 24 },
            { date: 'Tue', sales: 3000, orders: 13 },
            { date: 'Wed', sales: 2000, orders: 98 },
            { date: 'Thu', sales: 2780, orders: 39 },
            { date: 'Fri', sales: 1890, orders: 48 },
            { date: 'Sat', sales: 2390, orders: 38 },
            { date: 'Sun', sales: 3490, orders: 43 },
        ], 
        categories: [
            { name: 'Electronics', value: 400 },
            { name: 'Apparel', value: 300 },
            { name: 'Home', value: 300 },
            { name: 'Accessories', value: 200 },
        ] 
      };
    }
  },

  async getRecentOrders() {
    try {
      const res = await fetchWithTimeout(`${API_URL}/recent-orders`, { headers: getAuthHeader('admin') });
      if (!res.ok) throw new Error('Failed to fetch orders');
      return await res.json();
    } catch (error) {
      // Get from mock DB
      const orders = db.getOrders();
      return orders.slice(0, 5).map(o => ({
          ...o,
          createdAt: o.date || new Date().toISOString()
      }));
    }
  },

  async getTopProducts() {
    try {
      const res = await fetchWithTimeout(`${API_URL}/top-products`, { headers: getAuthHeader('admin') });
      if (!res.ok) throw new Error('Failed to fetch top products');
      return await res.json();
    } catch (error) {
      // Return simple mock
      const products = db.getProducts();
      return products.slice(0, 5).map(p => ({
          ...p,
          salesCount: Math.floor(Math.random() * 100)
      }));
    }
  },

  async getLowStock() {
    try {
      const res = await fetchWithTimeout(`${API_URL}/low-stock`, { headers: getAuthHeader('admin') });
      if (!res.ok) throw new Error('Failed to fetch low stock');
      return await res.json();
    } catch (error) {
      const products = db.getProducts();
      return products.filter(p => p.inventory <= 10).slice(0, 5).map(p => ({
          ...p,
          stock: p.inventory
      }));
    }
  }
};