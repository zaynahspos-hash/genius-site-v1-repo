import { API_BASE_URL, getAuthHeader, safeFetch } from './apiConfig';

const API_URL = `${API_BASE_URL}/store/recommendations`;

export const recommendationService = {
  async getRelated(productId: string) {
    try {
      const res = await fetch(`${API_URL}/products/${productId}/related`);
      if (!res.ok) return [];
      return await res.json();
    } catch (e) {
      return [];
    }
  },

  async getFrequentlyBought(productId: string) {
    try {
      const res = await fetch(`${API_URL}/products/${productId}/frequently-bought`);
      if (!res.ok) return [];
      return await res.json();
    } catch (e) {
      return [];
    }
  },

  async getRecentlyViewed() {
    try {
      // Get from local storage first to send IDs if guest
      const localIds = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
      const query = localIds.length > 0 ? `?ids=${localIds.join(',')}` : '';
      
      const res = await fetch(`${API_URL}/recently-viewed${query}`, { headers: getAuthHeader('customer') });
      if (!res.ok) return [];
      return await res.json();
    } catch (e) {
      return [];
    }
  },

  async trackView(productId: string) {
    // 1. Local Storage Update
    let recent = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
    recent = [productId, ...recent.filter((id: string) => id !== productId)].slice(0, 10);
    localStorage.setItem('recentlyViewed', JSON.stringify(recent));

    // 2. Server Update (non-blocking)
    try {
      await fetch(`${API_URL}/track-view/${productId}`, { 
          method: 'POST',
          headers: getAuthHeader('customer')
      });
    } catch (e) {}
  },

  async getTrending() {
    try {
      const res = await fetch(`${API_URL}/trending`);
      if(!res.ok) return [];
      return await res.json();
    } catch (e) {
      return [];
    }
  }
};