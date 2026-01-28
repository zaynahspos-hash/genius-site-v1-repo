import { API_BASE_URL, getAuthHeader, safeFetch } from './apiConfig';

const API_URL = `${API_BASE_URL}/admin/collections`;

export const collectionService = {
  async getAll() {
    const res = await safeFetch(API_URL);
    return await res.json();
  },

  async getById(id: string) {
    const res = await safeFetch(`${API_URL}/${id}`, { headers: getAuthHeader() });
    return await res.json();
  },

  async save(data: any) {
    const res = await safeFetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data)
    });
    return await res.json();
  },

  async delete(id: string) {
    const res = await safeFetch(`${API_URL}/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader()
    });
    return await res.json();
  }
};