const API_URL = 'http://localhost:5000/api/admin/coupons';

const getAuthHeader = () => {
  const token = localStorage.getItem('adminToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const couponService = {
  async getAll() {
    const res = await fetch(API_URL, { headers: getAuthHeader() });
    if (!res.ok) throw new Error('Failed to fetch coupons');
    return await res.json();
  },

  async create(data: any) {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to create coupon');
    return await res.json();
  },

  async update(id: string, data: any) {
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update coupon');
    return await res.json();
  },

  async delete(id: string) {
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader()
    });
    if (!res.ok) throw new Error('Failed to delete coupon');
    return await res.json();
  }
};