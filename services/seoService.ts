const API_URL = 'http://localhost:5000/api/seo';
const ADMIN_API = 'http://localhost:5000/api/admin/seo'; // To keep consistent naming even if route is same file

const getAuthHeader = () => {
  const token = localStorage.getItem('adminToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const seoService = {
  // Admin
  async getRedirects() {
    const res = await fetch(`${API_URL}/redirects`, { headers: getAuthHeader() });
    if (!res.ok) throw new Error('Failed to fetch redirects');
    return await res.json();
  },

  async createRedirect(data: { from: string, to: string, type: number }) {
    const res = await fetch(`${API_URL}/redirects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to create redirect');
    return await res.json();
  },

  async deleteRedirect(id: string) {
    const res = await fetch(`${API_URL}/redirects/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader()
    });
    if (!res.ok) throw new Error('Failed to delete redirect');
    return await res.json();
  },

  async runAudit() {
    const res = await fetch(`${API_URL}/audit`, { headers: getAuthHeader() });
    if (!res.ok) throw new Error('Failed to run audit');
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