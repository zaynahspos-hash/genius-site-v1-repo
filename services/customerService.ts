import { User, Order, Address, Product } from '../types';
import { API_BASE_URL, getAuthHeader } from './apiConfig';

const API_URL = `${API_BASE_URL}/customer`;

export const customerService = {
  // --- Auth ---
  async register(name, email, password) {
    const res = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Registration failed');
    }
    const data = await res.json();
    this.setSession(data);
    return data;
  },

  async login(email, password) {
    const res = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Login failed');
    }
    const data = await res.json();
    this.setSession(data);
    return data;
  },

  logout() {
    localStorage.removeItem('customerToken');
    localStorage.removeItem('customerUser');
  },

  setSession(data: any) {
    localStorage.setItem('customerToken', data.token);
    localStorage.setItem('customerUser', JSON.stringify(data));
  },

  getCurrentUser() {
    return JSON.parse(localStorage.getItem('customerUser') || 'null');
  },

  isAuthenticated() {
      return !!localStorage.getItem('customerToken');
  },

  // --- Profile ---
  async getProfile() {
    const res = await fetch(`${API_URL}/profile`, { headers: getAuthHeader('customer') });
    if (!res.ok) throw new Error('Failed to fetch profile');
    const user = await res.json();
    // Update local storage user info just in case
    const current = this.getCurrentUser();
    if(current) {
        localStorage.setItem('customerUser', JSON.stringify({ ...current, ...user }));
    }
    return user;
  },

  async updateProfile(data: any) {
    const res = await fetch(`${API_URL}/profile`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        ...getAuthHeader('customer') 
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update profile');
    const user = await res.json();
    this.setSession(user);
    return user;
  },

  // --- Orders ---
  async getOrders() {
    const res = await fetch(`${API_URL}/orders`, { headers: getAuthHeader('customer') });
    if (!res.ok) throw new Error('Failed to fetch orders');
    return await res.json();
  },

  // --- Addresses ---
  async addAddress(address: Address) {
    const res = await fetch(`${API_URL}/addresses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader('customer'),
      },
      body: JSON.stringify(address),
    });
    if (!res.ok) throw new Error('Failed to add address');
    return await res.json();
  },

  async removeAddress(id: string) {
    const res = await fetch(`${API_URL}/addresses/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader('customer'),
    });
    if (!res.ok) throw new Error('Failed to remove address');
    return await res.json();
  },

  // --- Wishlist ---
  async toggleWishlist(productId: string) {
    const res = await fetch(`${API_URL}/wishlist`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader('customer'),
      },
      body: JSON.stringify({ productId }),
    });
    if (!res.ok) throw new Error('Failed to update wishlist');
    return await res.json();
  }
};