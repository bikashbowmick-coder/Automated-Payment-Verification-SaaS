/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';
import { useAuth } from '../../features/auth/context/AuthContext.tsx';
import { useI18n } from '../../locales/I18nContext.tsx';
import { useToast } from '../../components/ui/Toast.tsx';
import { Button } from '../../components/ui/Button.tsx';
import { Dialog } from '../../components/ui/Dialog.tsx';

export const PendingDeletionBanner: React.FC = () => {
  const { user, updateUserStatus } = useAuth();
  const { t, formatDate } = useI18n();
  const { success } = useToast();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  if (user?.status !== 'pending_deletion') {
    return null;
  }

  const scheduledDate = user.deletionScheduledAt
    ? formatDate(user.deletionScheduledAt, { dateStyle: 'long' })
    : 'in 14 days';

  const handleCancelDeletion = async () => {
    setIsCancelling(true);
    try {
      await new Promise((r) => setTimeout(r, 400));
      updateUserStatus({
        status: 'active',
        deletionScheduledAt: undefined,
      });
      setIsConfirmOpen(false);
      success(t('toast_deletion_cancelled'));
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <>
      <div
        role="alert"
        aria-live="polite"
        className="w-full bg-amber-500/15 border-b border-amber-500/30 text-amber-900 dark:text-amber-200 px-4 sm:px-8 py-3"
      >
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs sm:text-sm">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" aria-hidden="true" />
            <div>
              <strong className="font-semibold">{t('pending_deletion_banner_title')}: </strong>
              <span>
                {t('pending_deletion_banner_desc', { date: scheduledDate })}
              </span>
            </div>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsConfirmOpen(true)}
            leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
            className="border-amber-600/40 text-amber-900 dark:text-amber-200 hover:bg-amber-500/20 shrink-0"
          >
            {t('cancel_deletion_btn')}
          </Button>
        </div>
      </div>

      <Dialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        title={t('cancel_deletion_btn')}
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600 dark:text-slate-300">
            {t('cancel_deletion_confirm')}
          </p>
          <div className="flex items-center justify-end gap-2.5 pt-2">
            <Button
              variant="outline"
              size="md"
              onClick={() => setIsConfirmOpen(false)}
              disabled={isCancelling}
            >
              {t('cancel_action')}
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={handleCancelDeletion}
              isLoading={isCancelling}
            >
              {t('yes_keep_account')}
            </Button>
          </div>
        </div>
      </Dialog>
    </>
  );
};
