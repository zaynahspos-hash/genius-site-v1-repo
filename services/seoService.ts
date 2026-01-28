import { API_BASE_URL, getAuthHeader, safeFetch } from './apiConfig';

const API_URL = `${API_BASE_URL}/seo`;

export const seoService = {
  // Admin
  async getRedirects() {
    const res = await safeFetch(`${API_URL}/redirects`, { headers: getAuthHeader() });
    return await res.json();
  },

  async createRedirect(data: { from: string, to: string, type: number }) {
    const res = await safeFetch(`${API_URL}/redirects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data)
    });
    return await res.json();
  },

  async deleteRedirect(id: string) {
    const res = await safeFetch(`${API_URL}/redirects/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader()
    });
    return await res.json();
  },

  async runAudit() {
    const res = await safeFetch(`${API_URL}/audit`, { headers: getAuthHeader() });
    return await res.json();
  },

  // Public
  async checkRedirect(path: string) {
    try {
        const res = await fetch(`${API_URL}/check-redirect?path=${encodeURIComponent(path)}`);
        if (!res.ok) return null;
        return await res.json();
    } catch(e) { return null; }
  }
};