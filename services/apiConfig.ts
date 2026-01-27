
// Always use environment variable in production, fallback to localhost for local development
const getBaseUrl = () => {
  // Check for Vite-specific environment variable
  if (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_API_URL) {
    return (import.meta as any).env.VITE_API_URL;
  }
  
  // Default for local development
  // In development, Vite proxy handles '/api' -> 'http://localhost:5000/api'
  // But if calling directly from browser code, we might need the full URL
  return window.location.hostname === 'localhost' ? 'http://localhost:5000/api' : '/api';
};

export const API_BASE_URL = getBaseUrl();

export const getAuthHeader = (type: 'admin' | 'customer' = 'admin') => {
  const token = localStorage.getItem(`${type}Token`);
  return token ? { Authorization: `Bearer ${token}` } : {};
};
