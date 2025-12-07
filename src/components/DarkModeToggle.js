'use client';

import { useTheme } from '@/contexts/ThemeContext';

export default function DarkModeToggle() {
  const { darkMode, setDarkMode } = useTheme();

  return (
    <div>
      <input type="checkbox" id="dark-mode" className="hidden" checked={darkMode} onChange={() => setDarkMode(!darkMode)} />
      <label htmlFor="dark-mode" className="cursor-pointer">
        <span className="w-12 h-6 bg-gray-200 dark:bg-gray-700 rounded-full transition-colors"></span>
        <span className="w-6 h-6 bg-white dark:bg-gray-200 rounded-full transition-transform"></span>
      </label>
    </div>
  );
}

