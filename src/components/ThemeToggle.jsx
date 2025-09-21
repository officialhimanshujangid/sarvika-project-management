import { useTheme } from '../contexts/ThemeContext';
import { FiSun, FiMoon } from 'react-icons/fi';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors"
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? (
        <FiMoon size={20} className="text-[var(--text-primary)]" />
      ) : (
        <FiSun size={20} className="text-[var(--text-primary)]" />
      )}
    </button>
  );
};

export default ThemeToggle;
