import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle({ size = 20 }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      id="theme-toggle"
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      className="relative flex items-center justify-center rounded-full transition-all"
      style={{
        width: `${size + 16}px`,
        height: `${size + 16}px`,
        backgroundColor: 'var(--accent-soft)',
        color: 'var(--text-primary)',
        transition: 'var(--transition-base)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = 'var(--accent-soft-hover)';
        e.currentTarget.style.transform = 'scale(1.08)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'var(--accent-soft)';
        e.currentTarget.style.transform = 'scale(1)';
      }}
    >
      <div
        style={{
          transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.2s ease',
          transform: isDark ? 'rotate(0deg)' : 'rotate(360deg)',
        }}
      >
        {isDark ? (
          <Moon size={size} strokeWidth={1.75} />
        ) : (
          <Sun size={size} strokeWidth={1.75} />
        )}
      </div>
    </button>
  );
}
