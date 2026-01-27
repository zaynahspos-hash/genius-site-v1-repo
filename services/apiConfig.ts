// Configuration for API Base URL
const getBaseUrl = () => {
  // 1. Check for Vite environment variable (Set this in Vercel)
  // Example: VITE_API_URL=https://your-backend.onrender.com/api
  if (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_API_URL) {
    return (import.meta as any).env.VITE_API_URL;
  }
  
  // 2. Fallback for Local Development
  if (window.location.hostname === 'localhost') {
    return 'http://localhost:5000/api';
  }

  // 3. Fallback for Production (Absolute path)
  // Replace the string below with your actual Render URL if not using env vars
  return 'https://your-backend-url.onrender.com/api';
};

export const API_BASE_URL = getBaseUrl();

export const getAuthHeader = (type: 'admin' | 'customer' = 'admin') => {
  const token = localStorage.getItem(`${type}Token`);
  return token ? { Authorization: `Bearer ${token}` } : {};
};