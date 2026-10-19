import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

export const ThemeToggle = ({ className = '' }) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Cambiar tema de color"
      className={`w-9 h-9 rounded-lg bg-bg-surface hover:bg-surface-hover text-text-muted hover:text-text-main flex items-center justify-center transition-colors border border-border-subtle ${className}`}
    >
      {isDark ? (
        <Sun className="w-[18px] h-[18px] text-accent-cyan" />
      ) : (
        <Moon className="w-[18px] h-[18px] text-accent-purple" />
      )}
    </button>
  );
};

export default ThemeToggle;
