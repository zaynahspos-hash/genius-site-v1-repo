import { API_BASE_URL, getAuthHeader, safeFetch } from './apiConfig';

const API_URL = `${API_BASE_URL}/reports`;

export const reportService = {
  async getSales(period = '30d') {
    const res = await safeFetch(`${API_URL}/sales?period=${period}`, { headers: getAuthHeader() });
    return await res.json();
  },

  async getBreakdown() {
    const res = await safeFetch(`${API_URL}/sales/breakdown`, { headers: getAuthHeader() });
    return await res.json();
  },

  async getOrders() {
    const res = await safeFetch(`${API_URL}/orders`, { headers: getAuthHeader() });
    return await res.json();
  },

  async getCustomers() {
    const res = await safeFetch(`${API_URL}/customers`, { headers: getAuthHeader() });
    return await res.json();
  },

  async getInventory() {
    const res = await safeFetch(`${API_URL}/inventory`, { headers: getAuthHeader() });
    return await res.json();
  },

  async exportData(type: string) {
    const res = await safeFetch(`${API_URL}/export`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
        body: JSON.stringify({ type })
    });
    return await res.text(); // CSV string
  }
};