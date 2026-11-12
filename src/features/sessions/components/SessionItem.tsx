/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Laptop, Smartphone, Globe, MapPin, Clock } from 'lucide-react';
import { UserSession } from '../../../lib/types.ts';
import { Button } from '../../../components/ui/Button.tsx';
import { Badge } from '../../../components/ui/Badge.tsx';
import { useI18n } from '../../../locales/I18nContext.tsx';

export interface SessionItemProps {
  session: UserSession;
  isCurrent: boolean;
  onRevoke: (sessionId: string) => void;
  isRevoking: boolean;
}

export const SessionItem: React.FC<SessionItemProps> = React.memo(
  ({ session, isCurrent, onRevoke, isRevoking }) => {
    const { t, formatRelativeTime, formatDate } = useI18n();

    const isMobile =
      session.os.toLowerCase().includes('ios') ||
      session.os.toLowerCase().includes('android');

    return (
      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111A2E] gap-4 transition-colors">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300 shrink-0 mt-0.5">
            {isMobile ? (
              <Smartphone className="w-5 h-5" aria-hidden="true" />
            ) : (
              <Laptop className="w-5 h-5" aria-hidden="true" />
            )}
          </div>

          <div className="space-y-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                {session.deviceLabel}
              </h3>
              {isCurrent && (
                <Badge variant="success" size="sm">
                  {t('current_device_badge')}
                </Badge>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1 font-mono">
                <Globe className="w-3.5 h-3.5 text-slate-400 shrink-0" aria-hidden="true" />
                <span>{session.ipAddress}</span>
              </span>

              {session.approxLocation && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" aria-hidden="true" />
                  <span>{session.approxLocation}</span>
                </span>
              )}

              <span
                className="flex items-center gap-1"
                title={`Absolute: ${formatDate(session.lastActiveAt)}`}
              >
                <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" aria-hidden="true" />
                <span>{formatRelativeTime(session.lastActiveAt)}</span>
              </span>
            </div>
          </div>
        </div>

        <div className="sm:self-center shrink-0">
          {!isCurrent && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onRevoke(session.id)}
              isLoading={isRevoking}
              className="text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-900 hover:bg-rose-50 dark:hover:bg-rose-950/30"
            >
              {t('revoke_session_button')}
            </Button>
          )}
        </div>
      </div>
    );
  }
);

SessionItem.displayName = 'SessionItem';
