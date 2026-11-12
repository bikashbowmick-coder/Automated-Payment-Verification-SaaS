/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Shield, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '../../features/auth/context/AuthContext.tsx';
import { useI18n } from '../../locales/I18nContext.tsx';

export const UserMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, logout } = useAuth();
  const { t } = useI18n();
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setIsOpen(false);
    await logout();
    navigate('/login');
  };

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((p) => p[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <div ref={dropdownRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label="User navigation menu"
        className="flex items-center gap-2 p-1 pl-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#4F46E5]"
      >
        {user?.avatarUrl ? (
          <img
            src={user.avatarUrl}
            alt={user.fullName || 'User avatar'}
            className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-700"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-[#14595A] text-white flex items-center justify-center font-bold text-xs">
            {getInitials(user?.fullName)}
          </div>
        )}
        <span className="hidden md:inline text-xs font-semibold text-slate-800 dark:text-slate-200 max-w-[120px] truncate">
          {user?.fullName || 'Merchant'}
        </span>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
      </button>

      {isOpen && (
        <div
          role="menu"
          aria-label="Account options"
          className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111A2E] shadow-xl z-50 p-1.5 animate-in fade-in duration-150"
        >
          <div className="p-2.5 border-b border-slate-100 dark:border-slate-800 mb-1">
            <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
              {user?.fullName}
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
              {user?.email}
            </p>
          </div>

          <Link
            to="/settings/profile"
            role="menuitem"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <User className="w-4 h-4 text-slate-400" aria-hidden="true" />
            <span>{t('nav_profile')}</span>
          </Link>

          <Link
            to="/settings/security"
            role="menuitem"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Shield className="w-4 h-4 text-slate-400" aria-hidden="true" />
            <span>{t('nav_security')}</span>
          </Link>

          <div className="my-1 border-t border-slate-100 dark:border-slate-800" />

          <button
            type="button"
            role="menuitem"
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors text-left"
          >
            <LogOut className="w-4 h-4" aria-hidden="true" />
            <span>{t('sign_out_button')}</span>
          </button>
        </div>
      )}
    </div>
  );
};
