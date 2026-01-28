import { API_BASE_URL, getAuthHeader, safeFetch } from './apiConfig';

const API_URL = `${API_BASE_URL}/admin/categories`;

export const categoryService = {
  async getAll() {
    const res = await safeFetch(API_URL);
    return await res.json();
  },

  async create(data: any) {
    const res = await safeFetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data)
    });
    return await res.json();
  },

  async update(id: string, data: any) {
    const res = await safeFetch(`${API_URL}/${id}`, {
      method: 'PUT',
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
  },

  async reorder(orderedIds: string[]) {
    await safeFetch(`${API_URL}/reorder`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ orderedIds })
    });
  }
};