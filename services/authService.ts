import { API_BASE_URL, safeFetch, getAuthHeader } from './apiConfig';

const AUTH_URL = `${API_BASE_URL}/auth`;

export const authService = {
  async login(email, password) {
    // 1. Perform Login
    const res = await safeFetch(`${AUTH_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    
    // Temporarily set session to perform verification
    this.setSession(data);

    // 2. Immediate Verification Check ("The Bouncer")
    try {
      await this.verifyAdminAccess();
    } catch (error) {
      // If verification fails, clear session immediately
      this.logout();
      throw error; // Propagate error to UI
    }

    return data;
  },

  async verifyAdminAccess() {
    const res = await fetch(`${AUTH_URL}/verify-admin`, {
      headers: getAuthHeader('admin')
    });
    
    if (res.status === 403) {
      throw new Error('Access Denied: You are not authorized to access this panel.');
    }
    
    if (!res.ok) {
      throw new Error('Verification failed');
    }
    
    return true;
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