/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Building2, Plus, Phone, CheckCircle2, ShieldCheck, UserCheck } from 'lucide-react';
import { useBusiness } from '../context/BusinessContext.tsx';
import { useI18n } from '../../../locales/I18nContext.tsx';
import { Button } from '../../../components/ui/Button.tsx';
import { Badge } from '../../../components/ui/Badge.tsx';
import { Skeleton } from '../../../components/ui/Skeleton.tsx';
import { CreateBusinessModal } from '../components/CreateBusinessModal.tsx';

export const BusinessesPage: React.FC = () => {
  const { t } = useI18n();
  const { businesses, activeBusinessId, switchBusiness, isSwitching, isLoading } = useBusiness();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((p) => p[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            {t('businesses_title')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {t('businesses_subtitle')}
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => setIsModalOpen(true)}
          leftIcon={<Plus className="w-4 h-4" />}
          className="shrink-0 self-start sm:self-auto"
        >
          {t('add_business_button')}
        </Button>
      </div>

      {isLoading || isSwitching ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111A2E] space-y-4 shadow-xs"
            >
              <div className="flex items-center gap-3">
                <Skeleton variant="rect" width={48} height={48} />
                <div className="space-y-2 flex-1">
                  <Skeleton variant="text" width="60%" />
                  <Skeleton variant="text" width="40%" />
                </div>
              </div>
              <Skeleton variant="text" width="80%" />
              <div className="pt-2 flex justify-between">
                <Skeleton variant="rect" width={80} height={28} />
                <Skeleton variant="rect" width={100} height={32} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          {businesses.map((biz) => {
            const isActive = biz.id === activeBusinessId;
            return (
              <div
                key={biz.id}
                className={`flex flex-col justify-between p-5 sm:p-6 rounded-2xl border bg-white dark:bg-[#111A2E] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${
                  isActive
                    ? 'border-[#14595A] ring-1 ring-[#14595A] dark:border-teal-500/80 dark:ring-teal-500/80'
                    : 'border-slate-200 dark:border-slate-800'
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-[#14595A] text-white flex items-center justify-center font-bold text-base shadow-xs shrink-0">
                        {getInitials(biz.name)}
                      </div>
                      <div className="min-w-0">
                        <h2 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-slate-100 truncate">
                          {biz.name}
                        </h2>
                        <span className="text-xs text-slate-500 dark:text-slate-400 block truncate">
                          {biz.category}
                        </span>
                      </div>
                    </div>

                    {isActive && (
                      <Badge variant="success" size="sm" icon={<CheckCircle2 className="w-3.5 h-3.5" />}>
                        {t('active_business_badge')}
                      </Badge>
                    )}
                  </div>

                  {biz.phone && (
                    <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" aria-hidden="true" />
                      <span className="font-mono">{biz.phone}</span>
                    </div>
                  )}

                  {/* Metadata labels */}
                  <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                    <Badge variant="neutral" size="sm" icon={<UserCheck className="w-3.5 h-3.5" />}>
                      {biz.role === 'owner'
                        ? t('role_owner')
                        : biz.role === 'admin'
                        ? t('role_admin')
                        : t('role_staff')}
                    </Badge>
                    <Badge
                      variant={biz.status === 'active' ? 'success' : biz.status === 'pending' ? 'warning' : 'danger'}
                      size="sm"
                    >
                      {biz.status === 'active'
                        ? t('status_active')
                        : biz.status === 'pending'
                        ? t('status_pending')
                        : t('status_suspended')}
                    </Badge>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">
                    ID: {biz.id.slice(0, 12)}
                  </span>
                  {isActive ? (
                    <span className="text-xs font-semibold text-[#14595A] dark:text-teal-400 inline-flex items-center gap-1">
                      <ShieldCheck className="w-4 h-4" aria-hidden="true" />
                      Current Active
                    </span>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => switchBusiness(biz.id)}
                    >
                      {t('switch_to_business')}
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <CreateBusinessModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};
