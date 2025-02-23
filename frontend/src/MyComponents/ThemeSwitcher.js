import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  const themes = [
    { name: 'light', icon: 'sun', label: 'Light' },
    { name: 'dark', icon: 'moon', label: 'Dark' },
    { name: 'auto', icon: 'circle-half', label: 'Auto' }
  ];

  return (
    <div className="btn-group">
      {themes.map(t => (
        <button
          key={t.name}
          className={`btn btn-sm ${theme === t.name ? 'btn-primary' : 'btn-outline-primary'}`}
          onClick={() => setTheme(t.name)}
          title={t.label}
        >
          <i className={`bi bi-${t.icon}`}></i>
        </button>
      ))}
    </div>
  );
} 