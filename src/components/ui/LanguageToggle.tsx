/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Languages } from 'lucide-react';
import { useI18n } from '../../locales/I18nContext.tsx';

export const LanguageToggle: React.FC<{ className?: string; showLabel?: boolean }> = ({
  className = '',
  showLabel = true,
}) => {
  const { language, setLanguage, t } = useI18n();

  const handleToggle = () => {
    setLanguage(language === 'en' ? 'bn' : 'en');
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label={t('language_toggle')}
      title={t('language_toggle')}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#4F46E5] ${className}`}
    >
      <Languages className="w-4 h-4 text-[#14595A] dark:text-teal-400" aria-hidden="true" />
      {showLabel && (
        <span className="font-semibold">{language === 'en' ? 'বাংলা' : 'English'}</span>
      )}
    </button>
  );
};
