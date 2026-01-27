const API_URL = 'http://localhost:5000/api/reports';

const getAuthHeader = () => {
  const token = localStorage.getItem('adminToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const reportService = {
  async getSales(period = '30d') {
    const res = await fetch(`${API_URL}/sales?period=${period}`, { headers: getAuthHeader() });
    if (!res.ok) throw new Error('Failed to fetch sales report');
    return await res.json();
  },

  async getBreakdown() {
    const res = await fetch(`${API_URL}/sales/breakdown`, { headers: getAuthHeader() });
    if (!res.ok) throw new Error('Failed');
    return await res.json();
  },

  async getOrders() {
    const res = await fetch(`${API_URL}/orders`, { headers: getAuthHeader() });
    if (!res.ok) throw new Error('Failed');
    return await res.json();
  },

  async getCustomers() {
    const res = await fetch(`${API_URL}/customers`, { headers: getAuthHeader() });
    if (!res.ok) throw new Error('Failed');
    return await res.json();
  },

  async getInventory() {
    const res = await fetch(`${API_URL}/inventory`, { headers: getAuthHeader() });
    if (!res.ok) throw new Error('Failed');
    return await res.json();
  },

  async exportData(type: string) {
    const res = await fetch(`${API_URL}/export`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
        body: JSON.stringify({ type })
    });
    if (!res.ok) throw new Error('Export failed');
    return await res.text(); // CSV string
  }
};