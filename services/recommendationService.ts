const API_URL = 'http://localhost:5000/api/store/recommendations';

const getAuthHeader = () => {
  const token = localStorage.getItem('customerToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const recommendationService = {
  async getRelated(productId: string) {
    const res = await fetch(`${API_URL}/products/${productId}/related`);
    if (!res.ok) return [];
    return await res.json();
  },

  async getFrequentlyBought(productId: string) {
    const res = await fetch(`${API_URL}/products/${productId}/frequently-bought`);
    if (!res.ok) return [];
    return await res.json();
  },

  async getRecentlyViewed() {
    // Get from local storage first to send IDs if guest
    const localIds = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
    const query = localIds.length > 0 ? `?ids=${localIds.join(',')}` : '';
    
    const res = await fetch(`${API_URL}/recently-viewed${query}`, { headers: getAuthHeader() });
    if (!res.ok) return [];
    return await res.json();
  },

  async trackView(productId: string) {
    // 1. Local Storage Update
    let recent = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
    recent = [productId, ...recent.filter((id: string) => id !== productId)].slice(0, 10);
    localStorage.setItem('recentlyViewed', JSON.stringify(recent));

    // 2. Server Update
    await fetch(`${API_URL}/track-view/${productId}`, { 
        method: 'POST',
        headers: getAuthHeader()
    });
  },

  async getTrending() {
      const res = await fetch(`${API_URL}/trending`);
      if(!res.ok) return [];
      return await res.json();
  }
};