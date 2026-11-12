/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { NavLink } from 'react-router-dom';
import { User, Building2, Shield, Laptop, History, Trash2 } from 'lucide-react';
import { useI18n } from '../../locales/I18nContext.tsx';

export const SettingsNav: React.FC<{ className?: string; isMobile?: boolean }> = ({
  className = '',
  isMobile = false,
}) => {
  const { t } = useI18n();

  const links = [
    { to: '/settings/profile', label: t('nav_profile'), icon: User },
    { to: '/settings/businesses', label: t('nav_businesses'), icon: Building2 },
    { to: '/settings/security', label: t('nav_security'), icon: Shield },
    { to: '/settings/sessions', label: t('nav_sessions'), icon: Laptop },
    { to: '/settings/history', label: t('nav_history'), icon: History },
    { to: '/settings/delete-account', label: t('nav_delete_account'), icon: Trash2, danger: true },
  ];

  if (isMobile) {
    return (
      <nav
        aria-label="Settings navigation"
        className={`flex items-center gap-1 overflow-x-auto pb-2 border-b border-slate-200 dark:border-slate-800 no-scrollbar ${className}`}
      >
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 transition-colors ${
                  isActive
                    ? 'bg-[#14595A] text-white shadow-xs'
                    : link.danger
                    ? 'text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>{link.label}</span>
            </NavLink>
          );
        })}
      </nav>
    );
  }

  return (
    <nav aria-label="Settings sidebar navigation" className={`space-y-1 ${className}`}>
      {links.map((link) => {
        const Icon = link.icon;
        return (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-[#14595A] text-white shadow-xs'
                  : link.danger
                  ? 'text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80'
              }`
            }
          >
            <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>{link.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
};
