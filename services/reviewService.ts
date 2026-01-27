const API_URL = 'http://localhost:5000/api';

const getAuthHeader = () => {
  const token = localStorage.getItem('customerToken') || localStorage.getItem('adminToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const reviewService = {
  async getProductReviews(productId: string, params: any = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_URL}/products/${productId}/reviews?${query}`);
    if (!res.ok) throw new Error('Failed to fetch reviews');
    return await res.json();
  },

  async createReview(reviewData: any) {
    const res = await fetch(`${API_URL}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(reviewData)
    });
    if (!res.ok) throw new Error('Failed to submit review');
    return await res.json();
  },

  async markHelpful(id: string) {
    const res = await fetch(`${API_URL}/reviews/${id}/helpful`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    if (!res.ok) throw new Error('Failed');
    return await res.json();
  },

  // Admin
  async getAllReviews(status = 'all') {
      const res = await fetch(`${API_URL}/admin/reviews?status=${status}`, { headers: getAuthHeader() });
      if (!res.ok) throw new Error('Failed');
      return await res.json();
  },

  async updateStatus(id: string, status: string) {
      const res = await fetch(`${API_URL}/admin/reviews/${id}/status`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
          body: JSON.stringify({ status })
      });
      if(!res.ok) throw new Error('Failed');
      return await res.json();
  }
};