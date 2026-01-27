const API_URL = 'http://localhost:5000/api/pages';
const CONTACT_URL = 'http://localhost:5000/api/contact';

const getAuthHeader = () => {
  const token = localStorage.getItem('adminToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const pageService = {
  // Public
  async getPage(slug: string) {
    const res = await fetch(`${API_URL}/store/${slug}`);
    if (!res.ok) throw new Error('Failed to fetch page');
    return await res.json();
  },

  async submitContact(data: any) {
    const res = await fetch(CONTACT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if(!res.ok) throw new Error('Failed to send message');
    return await res.json();
  },

  // Admin
  async getAllPages() {
    const res = await fetch(`${API_URL}`, { headers: getAuthHeader() });
    if (!res.ok) throw new Error('Failed to fetch pages');
    return await res.json();
  },

  async savePage(page: any) {
    const res = await fetch(`${API_URL}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(page)
    });
    if (!res.ok) throw new Error('Failed to save page');
    return await res.json();
  },

  async deletePage(id: string) {
    const res = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: getAuthHeader()
    });
    if (!res.ok) throw new Error('Failed to delete');
    return await res.json();
  },

  async getSubmissions() {
      const res = await fetch(CONTACT_URL, { headers: getAuthHeader() });
      if (!res.ok) throw new Error('Failed to fetch submissions');
      return await res.json();
  },

  async updateSubmission(id: string, data: any) {
      const res = await fetch(`${CONTACT_URL}/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
          body: JSON.stringify(data)
      });
      if(!res.ok) throw new Error('Failed to update');
      return await res.json();
  }
};