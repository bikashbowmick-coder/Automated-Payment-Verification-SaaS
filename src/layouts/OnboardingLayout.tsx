/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { MessageSquareCode } from 'lucide-react';
import { useI18n } from '../locales/I18nContext.tsx';
import { ThemeToggle } from '../components/ui/ThemeToggle.tsx';
import { LanguageToggle } from '../components/ui/LanguageToggle.tsx';

export const OnboardingLayout: React.FC = () => {
  const { t } = useI18n();

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] dark:bg-[#0B1220] text-[#0F172A] dark:text-[#E5EDF9]">
      <a
        href="#onboarding-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 px-4 py-2 bg-[#14595A] text-white rounded-lg font-medium text-sm"
      >
        {t('skip_to_content')}
      </a>

      {/* Top Header */}
      <header className="w-full flex items-center justify-between px-4 sm:px-8 py-3.5 border-b border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-[#111A2E]/70 backdrop-blur-md">
        <Link to="/onboarding/create-business" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#14595A] flex items-center justify-center text-white">
            <MessageSquareCode className="w-4.5 h-4.5" aria-hidden="true" />
          </div>
          <span className="font-bold text-lg text-[#14595A] dark:text-teal-400">
            {t('app_name')}
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <main
        id="onboarding-content"
        className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-12 pb-24"
      >
        <div className="w-full max-w-xl bg-white dark:bg-[#111A2E] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-8 animate-in fade-in duration-200">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
