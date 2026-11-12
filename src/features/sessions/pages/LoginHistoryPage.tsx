/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  CheckCircle2,
  XCircle,
  AlertOctagon,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { LoginEvent } from '../../../lib/types.ts';
import { sessionService } from '../services/sessionService.ts';
import { Badge } from '../../../components/ui/Badge.tsx';
import { Skeleton } from '../../../components/ui/Skeleton.tsx';
import { EmptyState } from '../../../components/ui/EmptyState.tsx';
import { Button } from '../../../components/ui/Button.tsx';
import { useI18n } from '../../../locales/I18nContext.tsx';
import { PAGE_SIZE } from '../../../lib/constants.ts';

export const LoginHistoryPage: React.FC = () => {
  const { t, formatDate } = useI18n();
  const [searchParams, setSearchParams] = useSearchParams();

  // Read filters & page from URL search params
  const statusParam = (searchParams.get('status') as 'all' | 'success' | 'failed') || 'all';
  const daysParam = parseInt(searchParams.get('days') || '0', 10);
  const pageParam = parseInt(searchParams.get('page') || '1', 10);

  const [historyData, setHistoryData] = useState<{
    items: LoginEvent[];
    total: number;
    page: number;
    totalPages: number;
  }>({
    items: [],
    total: 0,
    page: 1,
    totalPages: 1,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isCancelled = false;
    setIsLoading(true);

    sessionService
      .getLoginHistory({
        status: statusParam,
        days: daysParam > 0 ? daysParam : undefined,
        page: pageParam,
        pageSize: PAGE_SIZE,
      })
      .then((res) => {
        if (!isCancelled) {
          setHistoryData(res);
          setIsLoading(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [statusParam, daysParam, pageParam]);

  const updateFilters = (newParams: Record<string, string>) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(newParams).forEach(([k, v]) => {
      if (!v || v === 'all' || v === '0') {
        next.delete(k);
      } else {
        next.set(k, v);
      }
    });
    // Reset to page 1 on filter changes unless changing page itself
    if (!('page' in newParams)) {
      next.delete('page');
    }
    setSearchParams(next);
  };

  const getStatusBadge = (status: LoginEvent['status']) => {
    if (status === 'success') {
      return (
        <Badge variant="success" size="sm" icon={<CheckCircle2 className="w-3.5 h-3.5" />}>
          {t('filter_status_success')}
        </Badge>
      );
    }
    if (status === 'blocked') {
      return (
        <Badge variant="danger" size="sm" icon={<AlertOctagon className="w-3.5 h-3.5" />}>
          Blocked Threat
        </Badge>
      );
    }
    return (
      <Badge variant="danger" size="sm" icon={<XCircle className="w-3.5 h-3.5" />}>
        Failed Password
      </Badge>
    );
  };

  const getMethodBadge = (method: LoginEvent['method']) => {
    const labels = {
      password: 'Password',
      google: 'Google Sign-In',
      '2fa': 'Password + 2FA',
    };
    return (
      <span className="font-mono text-xs text-slate-600 dark:text-slate-300">
        {labels[method]}
      </span>
    );
  };

  const startRecord = (historyData.page - 1) * PAGE_SIZE + 1;
  const endRecord = Math.min(historyData.page * PAGE_SIZE, historyData.total);

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          {t('history_title')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          {t('history_subtitle')}
        </p>
      </div>

      {/* Security alert callout */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-amber-200 dark:border-amber-900/50 bg-amber-50/70 dark:bg-amber-950/20 text-xs sm:text-sm">
        <div className="flex items-center gap-2.5 text-amber-900 dark:text-amber-200">
          <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" aria-hidden="true" />
          <span>{t('not_you_warning')}</span>
        </div>
        <Link
          to="/settings/security"
          className="font-semibold text-[#14595A] dark:text-teal-400 hover:underline shrink-0"
        >
          {t('secure_account_link')} →
        </Link>
      </div>

      {/* Filters Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111A2E]">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
          <Filter className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
          <span>Filters:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Status selector */}
          <select
            value={statusParam}
            onChange={(e) => updateFilters({ status: e.target.value })}
            aria-label="Filter by sign-in status"
            className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
          >
            <option value="all">{t('filter_status_all')}</option>
            <option value="success">{t('filter_status_success')}</option>
            <option value="failed">{t('filter_status_failed')}</option>
          </select>

          {/* Date range selector */}
          <select
            value={daysParam.toString()}
            onChange={(e) => updateFilters({ days: e.target.value })}
            aria-label="Filter by timeframe"
            className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
          >
            <option value="0">{t('date_filter_all')}</option>
            <option value="7">{t('date_filter_7days')}</option>
            <option value="30">{t('date_filter_30days')}</option>
          </select>
        </div>
      </div>

      {/* Data presentation: Desktop Table, Mobile Cards */}
      {isLoading ? (
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111A2E] flex items-center justify-between"
            >
              <Skeleton variant="text" width={100} />
              <Skeleton variant="text" width={140} />
              <Skeleton variant="text" width={120} />
              <Skeleton variant="text" width={80} />
            </div>
          ))}
        </div>
      ) : historyData.items.length === 0 ? (
        <EmptyState
          title={t('no_history_found')}
          description="Try broadening your status or date range filter to view older sign-in records."
          actionLabel="Clear Filters"
          onAction={() => setSearchParams(new URLSearchParams())}
        />
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111A2E] overflow-hidden shadow-xs">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/40 text-slate-500 dark:text-slate-400 font-semibold">
                  <th scope="col" className="py-3 px-4">{t('col_status')}</th>
                  <th scope="col" className="py-3 px-4">{t('col_device')}</th>
                  <th scope="col" className="py-3 px-4">{t('col_method')}</th>
                  <th scope="col" className="py-3 px-4">{t('col_ip')}</th>
                  <th scope="col" className="py-3 px-4">{t('col_location')}</th>
                  <th scope="col" className="py-3 px-4 text-right">{t('col_time')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300">
                {historyData.items.map((event) => (
                  <tr
                    key={event.id}
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-3 px-4 whitespace-nowrap">
                      {getStatusBadge(event.status)}
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-900 dark:text-slate-100 whitespace-nowrap">
                      {event.deviceLabel}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      {getMethodBadge(event.method)}
                    </td>
                    <td className="py-3 px-4 font-mono tabular-nums text-slate-500 whitespace-nowrap">
                      {event.ipAddress}
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400 whitespace-nowrap">
                      {event.approxLocation || 'Bangladesh'}
                    </td>
                    <td className="py-3 px-4 text-right font-mono tabular-nums text-slate-500 dark:text-slate-400 whitespace-nowrap">
                      {formatDate(event.occurredAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Stacked Card View */}
          <div className="block md:hidden space-y-3">
            {historyData.items.map((event) => (
              <div
                key={event.id}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111A2E] space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  {getStatusBadge(event.status)}
                  <span className="text-[11px] font-mono tabular-nums text-slate-400">
                    {formatDate(event.occurredAt, { month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' })}
                  </span>
                </div>
                <div className="font-semibold text-slate-900 dark:text-slate-100">
                  {event.deviceLabel}
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100 dark:border-slate-800">
                  <span className="font-mono">{event.ipAddress}</span>
                  <span>{event.approxLocation || 'Bangladesh'}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400 pt-2">
            <div>
              {t('showing_page', {
                start: startRecord,
                end: endRecord,
                total: historyData.total,
              })}
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={historyData.page <= 1}
                onClick={() => updateFilters({ page: (historyData.page - 1).toString() })}
                leftIcon={<ChevronLeft className="w-3.5 h-3.5" />}
              >
                {t('prev_page')}
              </Button>

              <span className="px-2 font-mono tabular-nums font-semibold text-slate-700 dark:text-slate-300">
                {historyData.page} / {historyData.totalPages}
              </span>

              <Button
                variant="outline"
                size="sm"
                disabled={historyData.page >= historyData.totalPages}
                onClick={() => updateFilters({ page: (historyData.page + 1).toString() })}
                rightIcon={<ChevronRight className="w-3.5 h-3.5" />}
              >
                {t('next_page')}
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
