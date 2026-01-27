const API_URL = 'http://localhost:5000/api/admin/categories';

const getAuthHeader = () => {
  const token = localStorage.getItem('adminToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const categoryService = {
  async getAll() {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error('Failed to fetch categories');
    return await res.json();
  },

  async create(data: any) {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to create category');
    return await res.json();
  },

  async update(id: string, data: any) {
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update category');
    return await res.json();
  },

  async delete(id: string) {
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader()
    });
    if (!res.ok) throw new Error('Failed to delete category');
    return await res.json();
  },

  async reorder(orderedIds: string[]) {
    await fetch(`${API_URL}/reorder`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ orderedIds })
    });
  }
};