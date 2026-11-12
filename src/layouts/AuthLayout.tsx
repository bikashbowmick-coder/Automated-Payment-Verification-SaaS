/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { ShieldCheck, MessageSquareCode, Building2, Check } from 'lucide-react';
import { useI18n } from '../locales/I18nContext.tsx';
import { ThemeToggle } from '../components/ui/ThemeToggle.tsx';
import { LanguageToggle } from '../components/ui/LanguageToggle.tsx';

export const AuthLayout: React.FC = () => {
  const { t } = useI18n();

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] dark:bg-[#0B1220] text-[#0F172A] dark:text-[#E5EDF9] transition-colors duration-200">
      {/* Skip to content link */}
      <a
        href="#auth-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 px-4 py-2 bg-[#14595A] text-white rounded-lg shadow-lg font-medium text-sm"
      >
        {t('skip_to_content')}
      </a>

      {/* Top utility row */}
      <header className="w-full flex items-center justify-between px-4 sm:px-8 py-3.5 border-b border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-[#111A2E]/70 backdrop-blur-md">
        <Link to="/login" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-[#14595A] dark:bg-teal-700 flex items-center justify-center text-white shadow-xs group-hover:bg-[#104849] transition-colors">
            <MessageSquareCode className="w-4.5 h-4.5" aria-hidden="true" />
          </div>
          <span className="font-bold text-lg tracking-tight text-[#14595A] dark:text-teal-400">
            {t('app_name')}
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </header>

      {/* Main 2-column or single-column layout */}
      <main
        id="auth-content"
        className="flex-1 flex items-stretch justify-center p-4 sm:p-6 lg:p-12 pb-24"
      >
        <div className="w-full max-w-5xl mx-auto flex flex-col lg:flex-row items-center lg:items-stretch gap-8 lg:gap-12 justify-center">
          {/* Left Brand & Trust Panel (Desktop prominent, mobile compact top) */}
          <section
            aria-label="Product value and trust"
            className="w-full lg:w-1/2 flex flex-col justify-between p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-[#14595A]/10 via-[#14595A]/5 to-transparent dark:from-teal-950/40 dark:via-slate-900/40 dark:to-transparent border border-[#14595A]/15 dark:border-teal-800/30 shadow-xs animate-in fade-in duration-300"
          >
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#14595A]/10 dark:bg-teal-900/40 text-[#14595A] dark:text-teal-300 text-xs font-semibold mb-4">
                <ShieldCheck className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>Bangladesh MFS Gateway</span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900 dark:text-white leading-tight mb-3 text-balance">
                {t('app_tagline')}
              </h1>

              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                {t('app_subtext')}
              </p>

              {/* Supported payment badges */}
              <div className="mb-8">
                <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2.5">
                  Supported Payment Rails
                </div>
                <div className="flex flex-wrap items-center gap-2 text-xs font-medium">
                  <span className="px-3 py-1.5 rounded-lg bg-pink-50 text-pink-700 dark:bg-pink-950/40 dark:text-pink-300 border border-pink-200 dark:border-pink-900/50">
                    bKash Merchant & Personal
                  </span>
                  <span className="px-3 py-1.5 rounded-lg bg-orange-50 text-orange-700 dark:bg-orange-950/40 dark:text-orange-300 border border-orange-200 dark:border-orange-900/50">
                    Nagad Islamic & Standard
                  </span>
                  <span className="px-3 py-1.5 rounded-lg bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300 border border-purple-200 dark:border-purple-900/50">
                    Rocket (DBBL)
                  </span>
                  <span className="px-3 py-1.5 rounded-lg bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200 dark:border-amber-900/50">
                    Upay
                  </span>
                </div>
              </div>

              {/* Trust bullets */}
              <div className="space-y-3.5 pt-2 border-t border-slate-200/60 dark:border-slate-800/60">
                {[t('trust_bullet_1'), t('trust_bullet_2'), t('trust_bullet_3')].map(
                  (text, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                      <div className="w-5 h-5 rounded-full bg-[#14595A]/15 dark:bg-teal-900/50 flex items-center justify-center text-[#14595A] dark:text-teal-300 shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5 stroke-[3]" aria-hidden="true" />
                      </div>
                      <span className="leading-normal">{text}</span>
                    </div>
                  )
                )}
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-slate-200/60 dark:border-slate-800/60 text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
              <span>© {new Date().getFullYear()} My SAS Inc.</span>
              <span className="flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Dhaka, Bangladesh</span>
              </span>
            </div>
          </section>

          {/* Right Form Card (max-width 440px) */}
          <section
            aria-label="Authentication form"
            className="w-full lg:w-1/2 max-w-[440px] flex items-center justify-center"
          >
            <div className="w-full bg-white dark:bg-[#111A2E] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-8 animate-in slide-in-from-bottom-3 duration-250">
              <Outlet />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};
