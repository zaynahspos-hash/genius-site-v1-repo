import { API_BASE_URL } from './apiConfig';

const API_URL = `${API_BASE_URL}/store`;

export const storeService = {
  async getInit() {
    const res = await fetch(`${API_URL}/init`);
    if (!res.ok) throw new Error('Failed to load store config');
    return await res.json();
  },

  async getProducts(params: any = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_URL}/products?${query}`);
    if (!res.ok) throw new Error('Failed to fetch products');
    return await res.json();
  },

  async getProduct(slug: string) {
    const res = await fetch(`${API_URL}/products/${slug}`);
    if (!res.ok) throw new Error('Failed to fetch product');
    return await res.json();
  },

  async subscribe(email: string) {
    const res = await fetch(`${API_URL}/newsletter`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    if (!res.ok) throw new Error('Subscription failed');
    return await res.json();
  },

  async checkCoupon(code: string, cartTotal: number) {
    const res = await fetch(`${API_URL}/cart/coupon`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, cartTotal })
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message);
    }
    return await res.json();
  },

  async checkout(orderData: any) {
      const res = await fetch(`${API_URL}/checkout`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orderData)
      });
      if(!res.ok) {
          const err = await res.json();
          throw new Error(err.message);
      }
      return await res.json();
  }
};