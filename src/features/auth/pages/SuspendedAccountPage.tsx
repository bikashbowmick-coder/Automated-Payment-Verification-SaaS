/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, Mail, ExternalLink, LogOut, Phone } from 'lucide-react';
import { Button } from '../../../components/ui/Button.tsx';
import { useAuth } from '../context/AuthContext.tsx';
import { useI18n } from '../../../locales/I18nContext.tsx';

export const SuspendedAccountPage: React.FC = () => {
  const { t } = useI18n();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="w-full space-y-6 text-center py-2 animate-in fade-in">
      <div className="w-14 h-14 rounded-full bg-rose-100 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto">
        <ShieldAlert className="w-8 h-8" aria-hidden="true" />
      </div>

      <div className="space-y-1.5">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
          {t('suspended_title')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          {t('suspended_subtitle')}
        </p>
      </div>

      {/* Reason Box */}
      <div className="p-4 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/70 dark:bg-rose-950/30 text-left space-y-1.5">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-rose-700 dark:text-rose-300">
          {t('suspended_reason_label')}
        </span>
        <p className="text-xs text-rose-900 dark:text-rose-200 leading-relaxed font-mono">
          {t('suspended_default_reason')}
        </p>
      </div>

      {/* Support Details */}
      <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 text-left space-y-3 text-xs text-slate-600 dark:text-slate-400">
        <div className="flex items-center gap-2 font-medium text-slate-900 dark:text-slate-200">
          <Mail className="w-4 h-4 text-[#14595A] dark:text-teal-400" aria-hidden="true" />
          <span>support@mysas.com.bd</span>
        </div>
        <div className="flex items-center gap-2 font-medium text-slate-900 dark:text-slate-200">
          <Phone className="w-4 h-4 text-[#14595A] dark:text-teal-400" aria-hidden="true" />
          <span>+880 9612-000000 (24/7 Helpline)</span>
        </div>
        <p className="leading-relaxed pt-1 border-t border-slate-200/60 dark:border-slate-800/60 text-[11px]">
          {t('suspended_email_info')}
        </p>
      </div>

      {/* Actions */}
      <div className="space-y-2.5 pt-2">
        <a
          href="mailto:support@mysas.com.bd?subject=Account%20Restriction%20Inquiry%20Ticket%20MYSAS-9284"
          className="inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-[#14595A] hover:bg-[#104849] text-white text-xs sm:text-sm font-medium rounded-lg transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#4F46E5]"
        >
          <span>{t('suspended_ticket_link')}</span>
          <ExternalLink className="w-4 h-4" aria-hidden="true" />
        </a>

        <Button
          variant="outline"
          onClick={handleSignOut}
          leftIcon={<LogOut className="w-4 h-4" />}
          className="w-full text-xs sm:text-sm"
        >
          {t('sign_out_button')}
        </Button>
      </div>
    </div>
  );
};
