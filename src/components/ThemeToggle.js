import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import './ThemeToggle.css';

const ThemeToggle = () => {
  const { darkMode, toggleTheme } = useTheme();

  return (
    <button 
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={`Switch to ${darkMode ? 'light' : 'dark'} mode`}
    >
      <div className="toggle-track">
        <div className={`toggle-thumb ${darkMode ? 'dark' : 'light'}`}>
          <div className="toggle-icon">
            {darkMode ? '🌙' : '☀️'}
          </div>
        </div>
      </div>
    </button>
  );
};

export default ThemeToggle;