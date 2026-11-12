/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ChevronsUpDown, Check, Plus, Search, Building2 } from 'lucide-react';
import { Business } from '../../lib/types.ts';
import { useI18n } from '../../locales/I18nContext.tsx';

export interface BusinessSwitcherProps {
  businesses: Business[];
  activeBusinessId: string;
  onSwitch: (businessId: string) => void;
  onCreateNew: () => void;
}

export const BusinessSwitcher: React.FC<BusinessSwitcherProps> = ({
  businesses,
  activeBusinessId,
  onSwitch,
  onCreateNew,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { t } = useI18n();

  const activeBusiness = useMemo(() => {
    return businesses.find((b) => b.id === activeBusinessId) || businesses[0];
  }, [businesses, activeBusinessId]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && businesses.length > 5 && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen, businesses.length]);

  const filteredBusinesses = useMemo(() => {
    if (!searchQuery.trim()) return businesses;
    const q = searchQuery.toLowerCase();
    return businesses.filter(
      (b) => b.name.toLowerCase().includes(q) || b.category.toLowerCase().includes(q)
    );
  }, [businesses, searchQuery]);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((part) => part[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <div ref={dropdownRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label="Switch business"
        className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#111A2E] hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#4F46E5]"
      >
        <div className="w-6 h-6 rounded-md bg-[#14595A] text-white flex items-center justify-center font-bold text-xs shrink-0">
          {activeBusiness ? getInitials(activeBusiness.name) : <Building2 className="w-3.5 h-3.5" />}
        </div>
        <div className="flex flex-col min-w-0 pr-1 max-w-[140px] sm:max-w-[200px]">
          <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
            {activeBusiness?.name || 'Select Business'}
          </span>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
            {activeBusiness?.category || 'MFS Merchant'}
          </span>
        </div>
        <ChevronsUpDown className="w-4 h-4 text-slate-400 shrink-0 ml-auto" aria-hidden="true" />
      </button>

      {isOpen && (
        <div
          role="listbox"
          aria-label="Businesses list"
          className="absolute left-0 top-full mt-1.5 w-72 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111A2E] shadow-xl z-50 overflow-hidden animate-in fade-in duration-150"
        >
          {businesses.length > 5 && (
            <div className="p-2 border-b border-slate-100 dark:border-slate-800">
              <div className="relative flex items-center">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5" aria-hidden="true" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder={t('search_businesses_placeholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-2.5 py-1.5 text-xs bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 rounded-md border border-slate-200 dark:border-slate-700 focus:outline-hidden focus:border-[#14595A]"
                />
              </div>
            </div>
          )}

          <div className="max-h-60 overflow-y-auto p-1.5 space-y-0.5">
            {filteredBusinesses.map((b) => {
              const isSelected = b.id === activeBusinessId;
              return (
                <div
                  key={b.id}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => {
                    onSwitch(b.id);
                    setIsOpen(false);
                  }}
                  className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors text-xs select-none ${
                    isSelected
                      ? 'bg-[#14595A]/10 dark:bg-teal-900/30 text-[#14595A] dark:text-teal-300 font-semibold'
                      : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0 pr-2">
                    <div
                      className={`w-6 h-6 rounded-md flex items-center justify-center font-bold text-[10px] shrink-0 ${
                        isSelected
                          ? 'bg-[#14595A] text-white'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {getInitials(b.name)}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="truncate">{b.name}</span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                        {b.category}
                      </span>
                    </div>
                  </div>
                  {isSelected && <Check className="w-4 h-4 shrink-0 text-[#14595A] dark:text-teal-400" aria-hidden="true" />}
                </div>
              );
            })}

            {filteredBusinesses.length === 0 && (
              <div className="p-3 text-center text-xs text-slate-400">
                {t('no_businesses_found')}
              </div>
            )}
          </div>

          <div className="p-1.5 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                onCreateNew();
              }}
              className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs font-medium text-[#14595A] dark:text-teal-400 hover:bg-slate-50 dark:hover:bg-slate-800/80 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>{t('add_business_button')}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
