// Configuration for API Base URL
const getBaseUrl = () => {
  // 1. Check for Vite environment variable (Set this in Vercel settings as VITE_API_URL)
  // Casting import.meta to any for environment access in this context
  const envUrl = (import.meta as any).env?.VITE_API_URL;
  if (envUrl) {
    return envUrl.endsWith('/api') ? envUrl : `${envUrl}/api`;
  }
  
  // 2. Fallback for Local Development
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:5000/api';
  }

  // 3. Fallback for Production (Render)
  return 'https://genius-site-v1-repo.onrender.com/api';
};

export const API_BASE_URL = getBaseUrl();

/**
 * Common fetch wrapper to handle errors consistently and provide user-friendly fallbacks
 */
export const safeFetch = async (url: string, options: RequestInit = {}) => {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Server responded with status: ${response.status}`);
    }
    return response;
  } catch (error: any) {
    // Handle technical connection errors (like net::ERR_CONNECTION_REFUSED or CORS blocks)
    if (error.name === 'TypeError' && (error.message === 'Failed to fetch' || error.message.includes('NetworkError'))) {
      throw new Error('Our servers are currently busy or unreachable. Please refresh and try again in a few seconds.');
    }
    throw error;
  }
};

export const getAuthHeader = (type: 'admin' | 'customer' = 'admin') => {
  const token = localStorage.getItem(`${type}Token`);
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};