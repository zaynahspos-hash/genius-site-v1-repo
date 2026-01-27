
import { StoreSettings } from '../types';
import { db } from './dbService';

const API_URL = 'http://localhost:5000/api/settings';
const ADMIN_API = 'http://localhost:5000/api/admin/settings';

const getAuthHeader = () => {
  const token = localStorage.getItem('adminToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const settingsService = {
  async getSettings(): Promise<StoreSettings> {
    const defaults = db.getSettings(); // Get robust local defaults
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error('Failed to fetch settings');
      const serverData = await res.json();
      
      // Deep merge to ensure no section is undefined
      return {
          ...defaults,
          ...serverData,
          general: { ...defaults.general, ...serverData.general },
          theme: { 
              ...defaults.theme, 
              ...serverData.theme,
              colors: { ...defaults.theme.colors, ...(serverData.theme?.colors || {}) },
              layout: { ...defaults.theme.layout, ...(serverData.theme?.layout || {}) },
              typography: { ...defaults.theme.typography, ...(serverData.theme?.typography || {}) }
          },
          homepage: { ...defaults.homepage, ...serverData.homepage },
          social: { ...defaults.social, ...serverData.social },
          payment: { ...defaults.payment, ...serverData.payment },
          shipping: { ...defaults.shipping, ...serverData.shipping },
          tax: { ...defaults.tax, ...serverData.tax },
          checkout: { ...defaults.checkout, ...serverData.checkout },
          email: { ...defaults.email, ...serverData.email },
          seo: { ...defaults.seo, ...serverData.seo },
          maintenance: { ...defaults.maintenance, ...serverData.maintenance }
      };
    } catch (error) {
      console.warn('Backend API unreachable, using local defaults');
      return defaults;
    }
  },

  async updateSettings(settings: Partial<StoreSettings>, section = 'all'): Promise<StoreSettings> {
    try {
      const payload = section === 'all' ? settings : settings[section as keyof StoreSettings];
      const res = await fetch(`${ADMIN_API}/${section}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Failed to update settings');
      return await res.json();
    } catch (error) {
      console.warn('Backend API unreachable, updating local state');
      const current = db.getSettings();
      const updated = { ...current };
      if (section === 'all') {
        Object.assign(updated, settings);
      } else {
        (updated as any)[section] = { ...(updated as any)[section], ...(settings as any) };
      }
      db.saveSettings(updated);
      return updated;
    }
  },

  async sendTestEmail(to: string) {
      const res = await fetch(`${ADMIN_API}/test-email`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
          body: JSON.stringify({ to })
      });
      if(!res.ok) throw new Error('Failed to send test email');
      return await res.json();
  },

  async getMenus() {
      try {
        const res = await fetch(`${ADMIN_API}/menus`, { headers: getAuthHeader() });
        if(!res.ok) throw new Error('Failed to get menus');
        const data = await res.json();
        return Array.isArray(data) ? data : [];
      } catch (error) {
        return []; 
      }
  },

  async saveMenu(menu: any) {
      const res = await fetch(`${ADMIN_API}/menus`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
          body: JSON.stringify(menu)
      });
      if(!res.ok) throw new Error('Failed to save menu');
      return await res.json();
  }
};
