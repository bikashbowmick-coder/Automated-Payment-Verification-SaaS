/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Laptop, LogOut } from 'lucide-react';
import { UserSession } from '../../../lib/types.ts';
import { sessionService } from '../services/sessionService.ts';
import { SessionItem } from '../components/SessionItem.tsx';
import { Button } from '../../../components/ui/Button.tsx';
import { Dialog } from '../../../components/ui/Dialog.tsx';
import { Skeleton } from '../../../components/ui/Skeleton.tsx';
import { EmptyState } from '../../../components/ui/EmptyState.tsx';
import { useToast } from '../../../components/ui/Toast.tsx';
import { useI18n } from '../../../locales/I18nContext.tsx';

export const SessionsPage: React.FC = () => {
  const { t } = useI18n();
  const { success } = useToast();

  const [sessions, setSessions] = useState<UserSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [revokingId, setRevokingId] = useState<string | null>(null);
  const [isRevokeAllOpen, setIsRevokeAllOpen] = useState(false);
  const [isRevokingAll, setIsRevokingAll] = useState(false);

  const loadSessions = async () => {
    setIsLoading(true);
    try {
      const data = await sessionService.getSessions();
      setSessions(data);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSessions();
  }, []);

  const handleRevokeSingle = async (sessionId: string) => {
    setRevokingId(sessionId);
    try {
      await sessionService.revokeSession(sessionId);
      setSessions((prev) => prev.filter((s) => s.id !== sessionId));
      success(t('toast_session_revoked'));
    } finally {
      setRevokingId(null);
    }
  };

  const handleRevokeAllOthers = async () => {
    setIsRevokingAll(true);
    try {
      await sessionService.revokeOtherSessions();
      setSessions((prev) => prev.filter((s) => s.isCurrent));
      setIsRevokeAllOpen(false);
      success(t('toast_all_sessions_revoked'));
    } finally {
      setIsRevokingAll(false);
    }
  };

  const otherSessionsCount = sessions.filter((s) => !s.isCurrent).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            {t('sessions_title')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {t('sessions_subtitle')}
          </p>
        </div>

        {otherSessionsCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsRevokeAllOpen(true)}
            leftIcon={<LogOut className="w-4 h-4 text-rose-600" />}
            className="text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-900 hover:bg-rose-50 self-start sm:self-auto shrink-0"
          >
            {t('revoke_all_others_button')}
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111A2E] flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <Skeleton variant="rect" width={40} height={40} />
                <div className="space-y-2">
                  <Skeleton variant="text" width={160} />
                  <Skeleton variant="text" width={220} />
                </div>
              </div>
              <Skeleton variant="rect" width={90} height={32} />
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {sessions.map((session) => (
            <SessionItem
              key={session.id}
              session={session}
              isCurrent={session.isCurrent}
              onRevoke={handleRevokeSingle}
              isRevoking={revokingId === session.id}
            />
          ))}

          {otherSessionsCount === 0 && sessions.length === 1 && (
            <EmptyState
              icon={<Laptop className="w-5 h-5" />}
              title="Only current session active"
              description={t('no_other_sessions')}
              className="mt-6"
            />
          )}
        </div>
      )}

      {/* Revoke All Others Confirmation Dialog */}
      <Dialog
        isOpen={isRevokeAllOpen}
        onClose={() => setIsRevokeAllOpen(false)}
        title={t('revoke_dialog_title')}
        description={t('revoke_dialog_desc')}
      >
        <div className="flex items-center justify-end gap-3 pt-3">
          <Button
            variant="outline"
            size="md"
            onClick={() => setIsRevokeAllOpen(false)}
            disabled={isRevokingAll}
          >
            {t('cancel_action')}
          </Button>
          <Button
            variant="danger"
            size="md"
            onClick={handleRevokeAllOthers}
            isLoading={isRevokingAll}
          >
            {t('confirm_revoke_action')}
          </Button>
        </div>
      </Dialog>
    </div>
  );
};
