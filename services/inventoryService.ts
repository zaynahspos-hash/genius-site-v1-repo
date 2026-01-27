const API_URL = 'http://localhost:5000/api/admin/inventory';

const getAuthHeader = () => {
  const token = localStorage.getItem('adminToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const inventoryService = {
  async getInventory() {
    const res = await fetch(API_URL, { headers: getAuthHeader() });
    if (!res.ok) throw new Error('Failed to fetch inventory');
    return await res.json();
  },

  async updateStock(id: string, variantId: string | undefined, stock: number) {
    const res = await fetch(`${API_URL}/update`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ id, variantId, stock })
    });
    if (!res.ok) throw new Error('Failed to update stock');
    return await res.json();
  }
};