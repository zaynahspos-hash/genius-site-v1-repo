import { API_BASE_URL, getAuthHeader, safeFetch } from './apiConfig';

const API_URL = `${API_BASE_URL}/admin/customers`;

export const customerAdminService = {
  async getAll() {
    const res = await safeFetch(API_URL, { headers: getAuthHeader() });
    return await res.json();
  },

  async getById(id: string) {
    const res = await safeFetch(`${API_URL}/${id}`, { headers: getAuthHeader() });
    return await res.json();
  }
};