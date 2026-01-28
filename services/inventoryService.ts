import { API_BASE_URL, getAuthHeader, safeFetch } from './apiConfig';

const API_URL = `${API_BASE_URL}/admin/inventory`;

export const inventoryService = {
  async getInventory() {
    const res = await safeFetch(API_URL, { headers: getAuthHeader() });
    return await res.json();
  },

  async updateStock(id: string, variantId: string | undefined, stock: number) {
    const res = await safeFetch(`${API_URL}/update`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ id, variantId, stock })
    });
    return await res.json();
  }
};