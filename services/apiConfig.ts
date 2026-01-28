// Configuration for API Base URL
const getBaseUrl = () => {
  const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  
  // 1. Prioritize Vite environment variable (Set VITE_API_URL in Vercel settings)
  const envUrl = (import.meta as any).env?.VITE_API_URL;
  if (envUrl) {
    return envUrl.endsWith('/api') ? envUrl : `${envUrl}/api`;
  }
  
  // 2. Local development fallback
  if (isLocalhost) {
    return 'http://localhost:5000/api';
  }

  // 3. Absolute Production fallback (Render)
  // This ensures that even if env vars are missing, the app doesn't try to call localhost:5000 on Vercel
  return 'https://genius-site-v1-repo.onrender.com/api';
};

export const API_BASE_URL = getBaseUrl();

/**
 * Common fetch wrapper to handle errors consistently and provide user-friendly fallbacks
 */
export const safeFetch = async (url: string, options: RequestInit = {}) => {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Accept': 'application/json',
        ...options.headers,
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Server Error (${response.status})`);
    }
    return response;
  } catch (error: any) {
    const isNetworkError = 
      error.name === 'TypeError' || 
      error.message.includes('fetch') || 
      error.message.includes('NetworkError') || 
      error.message.includes('Failed to fetch');

    if (isNetworkError) {
      console.error('API Connection Failed:', url);
      throw new Error('Connection failed. Please check if the backend server is running and accessible.');
    }
    throw error;
  }
};

export const getAuthHeader = (type: 'admin' | 'customer' = 'admin') => {
  const token = localStorage.getItem(`${type}Token`);
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};