import React, { createContext, useContext, useState, useEffect } from 'react';
import { StoreSettings } from '../types';
import { settingsService } from '../services/settingsService';

interface SettingsContextType {
  settings: StoreSettings | null;
  refreshSettings: () => Promise<void>;
  loading: boolean;
  error: any;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  const fetchSettings = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await settingsService.getSettings();
      setSettings(data);
      
      // Apply theme CSS variables globally
      if(data.theme?.colors?.primary) {
         document.documentElement.style.setProperty('--primary-color', data.theme.colors.primary);
      }
    } catch (err: any) {
      console.error('Failed to load settings', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, refreshSettings: fetchSettings, loading, error }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
