const API_URL = 'http://localhost:5000/api/admin/customers';

const getAuthHeader = () => {
  const token = localStorage.getItem('adminToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const customerAdminService = {
  async getAll() {
    const res = await fetch(API_URL, { headers: getAuthHeader() });
    if (!res.ok) throw new Error('Failed to fetch customers');
    return await res.json();
  },

  async getById(id: string) {
    const res = await fetch(`${API_URL}/${id}`, { headers: getAuthHeader() });
    if (!res.ok) throw new Error('Failed to fetch customer');
    return await res.json();
  }
};