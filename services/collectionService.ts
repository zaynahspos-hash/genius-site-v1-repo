const API_URL = 'http://localhost:5000/api/admin/collections';

const getAuthHeader = () => {
  const token = localStorage.getItem('adminToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const collectionService = {
  async getAll() {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error('Failed to fetch collections');
    return await res.json();
  },

  async getById(id: string) {
    const res = await fetch(`${API_URL}/${id}`, { headers: getAuthHeader() });
    if (!res.ok) throw new Error('Failed to fetch collection');
    return await res.json();
  },

  async save(data: any) {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to save collection');
    return await res.json();
  },

  async delete(id: string) {
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader()
    });
    if (!res.ok) throw new Error('Failed to delete collection');
    return await res.json();
  }
};