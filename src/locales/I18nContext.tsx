/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import enTranslations from './en.json';
import bnTranslations from './bn.json';
import { SupportedLanguage } from '../lib/types.ts';

interface I18nContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (key: string, variables?: Record<string, string | number>) => string;
  formatDate: (date: string | Date, options?: Intl.DateTimeFormatOptions) => string;
  formatRelativeTime: (date: string | Date) => string;
}

const I18nContext = createContext<I18nContextType | null>(null);

const translations: Record<SupportedLanguage, Record<string, string>> = {
  en: enTranslations,
  bn: bnTranslations,
};

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<SupportedLanguage>(() => {
    try {
      const saved = localStorage.getItem('mysas_lang') as SupportedLanguage;
      if (saved === 'en' || saved === 'bn') return saved;
    } catch {
      // ignore
    }
    return 'en';
  });

  const setLanguage = useCallback((lang: SupportedLanguage) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('mysas_lang', lang);
      document.documentElement.setAttribute('lang', lang);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('lang', language);
  }, [language]);

  const t = useCallback(
    (key: string, variables?: Record<string, string | number>): string => {
      const langDict = translations[language] || translations.en;
      let text = langDict[key] || translations.en[key] || key;

      if (variables) {
        Object.entries(variables).forEach(([varKey, val]) => {
          text = text.replace(new RegExp(`\\{${varKey}\\}`, 'g'), String(val));
        });
      }

      return text;
    },
    [language]
  );

  const formatDate = useCallback(
    (date: string | Date, options?: Intl.DateTimeFormatOptions): string => {
      const d = typeof date === 'string' ? new Date(date) : date;
      const locale = language === 'bn' ? 'bn-BD' : 'en-US';
      const defaultOptions: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        ...options,
      };
      try {
        return new Intl.DateTimeFormat(locale, defaultOptions).format(d);
      } catch {
        return d.toLocaleString();
      }
    },
    [language]
  );

  const formatRelativeTime = useCallback(
    (date: string | Date): string => {
      const d = typeof date === 'string' ? new Date(date) : date;
      const now = new Date();
      const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000);

      if (diffInSeconds < 60) {
        return language === 'bn' ? 'এইমাত্র' : 'Just now';
      }
      const diffInMinutes = Math.floor(diffInSeconds / 60);
      if (diffInMinutes < 60) {
        return language === 'bn' ? `${diffInMinutes} মিনিট আগে` : `${diffInMinutes}m ago`;
      }
      const diffInHours = Math.floor(diffInMinutes / 60);
      if (diffInHours < 24) {
        return language === 'bn' ? `${diffInHours} ঘণ্টা আগে` : `${diffInHours}h ago`;
      }
      const diffInDays = Math.floor(diffInHours / 24);
      return language === 'bn' ? `${diffInDays} দিন আগে` : `${diffInDays}d ago`;
    },
    [language]
  );

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      t,
      formatDate,
      formatRelativeTime,
    }),
    [language, setLanguage, t, formatDate, formatRelativeTime]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export function useI18n(): I18nContextType {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}
