import { API_BASE_URL, safeFetch } from './apiConfig';

const AUTH_URL = `${API_BASE_URL}/auth`;

export const authService = {
  async login(email, password) {
    const res = await safeFetch(`${AUTH_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    this.setSession(data);
    return data;
  },

  async register(name, email, password, storeName) {
    const res = await safeFetch(`${AUTH_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, storeName }),
    });

    const data = await res.json();
    this.setSession(data);
    return data;
  },

  async forgotPassword(email: string) {
    const res = await safeFetch(`${AUTH_URL}/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    return await res.json();
  },

  async resetPassword(token: string, password: string) {
    const res = await safeFetch(`${AUTH_URL}/reset-password/${token}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    return await res.json();
  },

  logout() {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    window.location.href = '/#/admin/login'; 
  },

  getCurrentUser() {
    try {
        const stored = localStorage.getItem('adminUser');
        return stored ? JSON.parse(stored) : null;
    } catch {
        return null;
    }
  },

  isAuthenticated() {
      return !!localStorage.getItem('adminToken');
  },

  setSession(data: any) {
      if (data.token) localStorage.setItem('adminToken', data.token);
      if (data.user || data.name) {
          const user = data.user || { id: data.id, name: data.name, email: data.email, role: data.role };
          localStorage.setItem('adminUser', JSON.stringify(user));
      }
  }
};
