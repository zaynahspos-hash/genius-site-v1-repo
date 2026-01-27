import { API_BASE_URL } from './apiConfig';
import { db } from './dbService';

const API_URL = `${API_BASE_URL}/admin`;

// Default "God Mode" User - Always available
const DEFAULT_ADMIN = {
  _id: 'admin_1',
  id: 'admin_1',
  name: 'Super Admin',
  email: 'admin@shopgenius.com',
  role: 'admin',
  token: 'auto-login-dev-token'
};

export const authService = {
  async login(email, password) {
    // BYPASS: Always succeed immediately
    console.log('Login bypassed - Auto logging in');
    this.setSession(DEFAULT_ADMIN);
    return DEFAULT_ADMIN;
  },

  async register(name, email, password, storeName) {
    // BYPASS: Create a mock user immediately
    const newUser = { id: 'u_' + Date.now(), name, email, role: 'admin' as const, addresses: [] };
    const data = { ...newUser, token: 'mock-jwt-token-' + Date.now() };
    this.setSession(data);
    return data;
  },

  async forgotPassword(email: string) {
    return { message: 'Reset link sent (Demo)' };
  },

  async resetPassword(token: string, password: string) {
    return { success: true };
  },

  logout() {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    // Reload to reset state, but getCurrentUser will auto-login again if accessed
    window.location.href = '/'; 
  },

  getCurrentUser() {
    try {
        const stored = localStorage.getItem('adminUser');
        if (stored) return JSON.parse(stored);
        
        // AUTO-LOGIN: If no user is found, create the session automatically
        // This ensures the Login screen is skipped entirely in App.tsx
        this.setSession(DEFAULT_ADMIN);
        return DEFAULT_ADMIN;
    } catch {
        return DEFAULT_ADMIN;
    }
  },

  isAuthenticated() {
      // Always true to bypass route protection
      return true;
  },

  setSession(user: any) {
      localStorage.setItem('adminToken', user.token || 'mock-token');
      localStorage.setItem('adminUser', JSON.stringify(user));
  }
};