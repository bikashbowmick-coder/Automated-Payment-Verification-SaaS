/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../app/ThemeContext.tsx';
import { useI18n } from '../../locales/I18nContext.tsx';

export const ThemeToggle: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { theme, toggleTheme } = useTheme();
  const { t } = useI18n();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={t('theme_toggle')}
      title={t('theme_toggle')}
      className={`p-2 rounded-lg text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#4F46E5] ${className}`}
    >
      {theme === 'dark' ? (
        <Sun className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-amber-400" aria-hidden="true" />
      ) : (
        <Moon className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-slate-600" aria-hidden="true" />
      )}
    </button>
  );
};
