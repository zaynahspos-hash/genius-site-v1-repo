// Configuration for API Base URL
const getBaseUrl = () => {
  // 1. Check for Vite environment variable (Set this in Vercel settings as VITE_API_URL)
  const envUrl = (import.meta as any).env?.VITE_API_URL;
  if (envUrl) {
    return envUrl.endsWith('/api') ? envUrl : `${envUrl}/api`;
  }
  
  // 2. Fallback for Local Development
  if (window.location.hostname === 'localhost') {
    return 'http://localhost:5000/api';
  }

  // 3. Fallback for Production (Aapka Render Backend Link)
  return 'https://genius-site-v1-repo.onrender.com/api';
};

export const API_BASE_URL = getBaseUrl();

export const getAuthHeader = (type: 'admin' | 'customer' = 'admin') => {
  const token = localStorage.getItem(`${type}Token`);
  return token ? { Authorization: `Bearer ${token}` } : {};
};