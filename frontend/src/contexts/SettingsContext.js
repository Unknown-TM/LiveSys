import React, { createContext, useContext, useState, useEffect } from 'react';

const SettingsContext = createContext();

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(() => {
    const savedSettings = localStorage.getItem('settings');
    return savedSettings ? JSON.parse(savedSettings) : {
      alerts: {
        cpu: 80,
        ram: 85,
        disk: 90,
        notifications: true,
        emailAlerts: false,
        refreshInterval: 5
      },
      display: {
        showGrid: true,
        compactView: false,
        chartAnimation: true
      },
      security: {
        autoLock: false,
        lockTimeout: 15,
        twoFactorEnabled: false
      }
    };
  });

  useEffect(() => {
    localStorage.setItem('settings', JSON.stringify(settings));
  }, [settings]);

  return (
    <SettingsContext.Provider value={{ settings, setSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
} 