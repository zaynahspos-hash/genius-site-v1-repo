import { API_BASE_URL, getAuthHeader, safeFetch } from './apiConfig';

const API_URL = `${API_BASE_URL}/pages`;
const CONTACT_URL = `${API_BASE_URL}/contact`;

export const pageService = {
  // Public
  async getPage(slug: string) {
    const res = await safeFetch(`${API_URL}/store/${slug}`);
    return await res.json();
  },

  async submitContact(data: any) {
    const res = await safeFetch(CONTACT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    return await res.json();
  },

  // Admin
  async getAllPages() {
    const res = await safeFetch(`${API_URL}`, { headers: getAuthHeader() });
    return await res.json();
  },

  async savePage(page: any) {
    const res = await safeFetch(`${API_URL}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(page)
    });
    return await res.json();
  },

  async deletePage(id: string) {
    const res = await safeFetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: getAuthHeader()
    });
    return await res.json();
  },

  async getSubmissions() {
      const res = await safeFetch(CONTACT_URL, { headers: getAuthHeader() });
      return await res.json();
  },

  async updateSubmission(id: string, data: any) {
      const res = await safeFetch(`${CONTACT_URL}/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
          body: JSON.stringify(data)
      });
      return await res.json();
  }
};