
import { API_BASE_URL } from './apiConfig';

const API_URL = `${API_BASE_URL}/gift-cards`;

export const giftCardService = {
  async checkBalance(code: string) {
    const res = await fetch(`${API_URL}/check`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code })
    });
    
    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.message || 'Invalid gift card');
    }
    return data;
  }
};
