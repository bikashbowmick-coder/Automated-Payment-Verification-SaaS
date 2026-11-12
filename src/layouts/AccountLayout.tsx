/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { MessageSquareCode, ShieldCheck } from 'lucide-react';
import { useI18n } from '../locales/I18nContext.tsx';
import { useBusiness } from '../features/business/context/BusinessContext.tsx';
import { BusinessSwitcher } from './components/BusinessSwitcher.tsx';
import { UserMenu } from './components/UserMenu.tsx';
import { SettingsNav } from './components/SettingsNav.tsx';
import { PendingDeletionBanner } from './components/PendingDeletionBanner.tsx';
import { ThemeToggle } from '../components/ui/ThemeToggle.tsx';
import { LanguageToggle } from '../components/ui/LanguageToggle.tsx';
import { CreateBusinessModal } from '../features/business/components/CreateBusinessModal.tsx';

export const AccountLayout: React.FC = () => {
  const { t } = useI18n();
  const { businesses, activeBusinessId, switchBusiness } = useBusiness();
  const [isAddBizOpen, setIsAddBizOpen] = useState(false);
  const location = useLocation();

  // Dynamic breadcrumb label
  const getPageTitle = () => {
    if (location.pathname.includes('/profile')) return t('nav_profile');
    if (location.pathname.includes('/businesses')) return t('nav_businesses');
    if (location.pathname.includes('/security')) return t('nav_security');
    if (location.pathname.includes('/sessions')) return t('nav_sessions');
    if (location.pathname.includes('/history')) return t('nav_history');
    if (location.pathname.includes('/delete-account')) return t('nav_delete_account');
    return t('nav_profile');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] dark:bg-[#0B1220] text-[#0F172A] dark:text-[#E5EDF9] transition-colors duration-200">
      <a
        href="#main-settings-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 px-4 py-2 bg-[#14595A] text-white rounded-lg shadow-lg font-medium text-sm"
      >
        {t('skip_to_content')}
      </a>

      {/* Top Bar Contract: 3-zone Header */}
      <header className="sticky top-0 z-30 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-[#111A2E]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Zone 1: Brand & Business Switcher */}
          <div className="flex items-center gap-3 sm:gap-6 min-w-0">
            <Link to="/settings/profile" className="flex items-center gap-2 shrink-0 group">
              <div className="w-8 h-8 rounded-lg bg-[#14595A] dark:bg-teal-700 flex items-center justify-center text-white shadow-xs group-hover:bg-[#104849] transition-colors">
                <MessageSquareCode className="w-4.5 h-4.5" aria-hidden="true" />
              </div>
              <span className="font-bold text-base sm:text-lg tracking-tight text-[#14595A] dark:text-teal-400 hidden sm:inline whitespace-nowrap">
                {t('app_name')}
              </span>
            </Link>

            <span className="h-5 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block" />

            <BusinessSwitcher
              businesses={businesses}
              activeBusinessId={activeBusinessId}
              onSwitch={switchBusiness}
              onCreateNew={() => setIsAddBizOpen(true)}
            />
          </div>

          {/* Zone 2: Breadcrumb / context indicator (hidden on small mobile) */}
          <div className="hidden lg:flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span>Settings</span>
            <span>/</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {getPageTitle()}
            </span>
          </div>

          {/* Zone 3: Actions & Profile */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <LanguageToggle />
            <ThemeToggle />
            <span className="h-5 w-px bg-slate-200 dark:bg-slate-700" />
            <UserMenu />
          </div>
        </div>
      </header>

      {/* Persistent Pending Deletion Banner if scheduled */}
      <PendingDeletionBanner />

      {/* Main settings viewport */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex-1 flex flex-col">
        {/* Mobile horizontal tab navigation */}
        <div className="block lg:hidden mb-6">
          <SettingsNav isMobile />
        </div>

        {/* 2-column Desktop Layout: left sidebar + content area */}
        <div className="flex-1 flex flex-col lg:flex-row gap-8 items-start">
          {/* Desktop Left Sidebar (240px) */}
          <aside
            aria-label="Settings section navigation"
            className="hidden lg:block w-60 shrink-0 sticky top-24"
          >
            <div className="mb-4 px-3.5">
              <h2 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Account Settings
              </h2>
            </div>
            <SettingsNav />

            {/* Quiet trust badge at bottom of sidebar */}
            <div className="mt-12 p-3.5 rounded-xl border border-slate-200/60 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/40 text-[11px] text-slate-500 dark:text-slate-400 space-y-1.5">
              <div className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
                <ShieldCheck className="w-3.5 h-3.5 text-[#14595A] dark:text-teal-400" />
                <span>PCI & MFS Compliant</span>
              </div>
              <p className="leading-relaxed">
                SMS reconciliation endpoints protected with AES-256 token hashing.
              </p>
            </div>
          </aside>

          {/* Right main settings viewport */}
          <main id="main-settings-content" className="flex-1 w-full min-w-0 pb-20">
            <Outlet />
          </main>
        </div>
      </div>

      {/* Add business modal dialog */}
      <CreateBusinessModal
        isOpen={isAddBizOpen}
        onClose={() => setIsAddBizOpen(false)}
      />
    </div>
  );
};
