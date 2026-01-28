import { API_BASE_URL, getAuthHeader, safeFetch } from './apiConfig';

const API_URL = API_BASE_URL;

export const reviewService = {
  async getProductReviews(productId: string, params: any = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await safeFetch(`${API_URL}/products/${productId}/reviews?${query}`);
    return await res.json();
  },

  async createReview(reviewData: any) {
    const res = await safeFetch(`${API_URL}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(reviewData)
    });
    return await res.json();
  },

  async markHelpful(id: string) {
    const res = await safeFetch(`${API_URL}/reviews/${id}/helpful`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    return await res.json();
  },

  // Admin
  async getAllReviews(status = 'all') {
      const res = await safeFetch(`${API_URL}/admin/reviews?status=${status}`, { headers: getAuthHeader() });
      return await res.json();
  },

  async updateStatus(id: string, status: string) {
      const res = await safeFetch(`${API_URL}/admin/reviews/${id}/status`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
          body: JSON.stringify({ status })
      });
      return await res.json();
  }
};