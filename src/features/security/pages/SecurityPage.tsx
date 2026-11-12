/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  ShieldAlert,
  KeyRound,
  Laptop,
  History,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { PasswordField } from '../../../components/ui/PasswordField.tsx';
import { Button } from '../../../components/ui/Button.tsx';
import { Badge } from '../../../components/ui/Badge.tsx';
import { FormError } from '../../../components/ui/FormError.tsx';
import { changePasswordSchema, ChangePasswordFormData } from '../../../lib/schemas.ts';
import { securityService } from '../services/securityService.ts';
import { SecurityOverview } from '../../../lib/types.ts';
import { TwoFactorSetupDialog } from '../components/TwoFactorSetupDialog.tsx';
import { Disable2FADialog } from '../components/Disable2FADialog.tsx';
import { useAuth } from '../../auth/context/AuthContext.tsx';
import { useI18n } from '../../../locales/I18nContext.tsx';
import { useToast } from '../../../components/ui/Toast.tsx';

export const SecurityPage: React.FC = () => {
  const { t, formatRelativeTime } = useI18n();
  const { user } = useAuth();
  const { success } = useToast();

  const [overview, setOverview] = useState<SecurityOverview | null>(null);
  const [isSetup2FAOpen, setIsSetup2FAOpen] = useState(false);
  const [isDisable2FAOpen, setIsDisable2FAOpen] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    },
    mode: 'onBlur',
  });

  const newPasswordValue = watch('newPassword');

  useEffect(() => {
    securityService.getSecurityOverview().then(setOverview);
  }, [user]);

  const onPasswordSubmit = async (data: ChangePasswordFormData) => {
    setPasswordError(null);
    try {
      await securityService.changePassword(data.currentPassword, data.newPassword);
      reset();
      success(t('toast_password_changed'));
      const updatedOverview = await securityService.getSecurityOverview();
      setOverview(updatedOverview);
    } catch {
      setPasswordError('Current password is incorrect. Please verify and try again.');
    }
  };

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          {t('security_title')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          {t('security_subtitle')}
        </p>
      </div>

      {/* Security Overview Card */}
      <section
        aria-label="Security health metrics"
        className="bg-white dark:bg-[#111A2E] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4"
      >
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-[#14595A] dark:text-teal-400" aria-hidden="true" />
          <h2 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-slate-100">
            {t('security_overview_title')}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
          {/* Email verification status */}
          <div className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 space-y-1.5">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-medium">
              {t('item_email_verified')}
            </span>
            <div className="flex items-center gap-1.5 font-semibold text-xs sm:text-sm">
              {user?.emailVerified ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-emerald-700 dark:text-emerald-400">{t('verified_status')}</span>
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4 text-rose-500" />
                  <span className="text-rose-600 dark:text-rose-400">{t('unverified_status')}</span>
                </>
              )}
            </div>
          </div>

          {/* 2FA Status */}
          <div className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 space-y-1.5">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-medium">
              {t('item_2fa_status')}
            </span>
            <div className="flex items-center gap-1.5 font-semibold text-xs sm:text-sm">
              {user?.twoFactorEnabled ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-emerald-700 dark:text-emerald-400">{t('enabled_status')}</span>
                </>
              ) : (
                <>
                  <ShieldAlert className="w-4 h-4 text-amber-500" />
                  <span className="text-amber-700 dark:text-amber-400">{t('disabled_status')}</span>
                </>
              )}
            </div>
          </div>

          {/* Last password changed */}
          <div className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 space-y-1.5">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-medium">
              {t('item_last_password')}
            </span>
            <div className="flex items-center gap-1.5 font-semibold text-xs sm:text-sm text-slate-900 dark:text-slate-100">
              <Clock className="w-4 h-4 text-slate-400" />
              <span>
                {overview?.lastPasswordChangedAt
                  ? formatRelativeTime(overview.lastPasswordChangedAt)
                  : '32 days ago'}
              </span>
            </div>
          </div>

          {/* Active device sessions count */}
          <div className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 space-y-1.5">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-medium">
              {t('item_active_sessions')}
            </span>
            <div className="flex items-center gap-1.5 font-semibold text-xs sm:text-sm text-slate-900 dark:text-slate-100">
              <Laptop className="w-4 h-4 text-[#14595A] dark:text-teal-400" />
              <span>{overview?.activeSessionsCount || 4} Devices Active</span>
            </div>
          </div>
        </div>
      </section>

      {/* Two-Factor Authentication Card */}
      <section
        aria-label="Two-factor authentication management"
        className="bg-white dark:bg-[#111A2E] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-4"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-slate-100">
                {t('two_factor_card_title')}
              </h2>
              <Badge variant={user?.twoFactorEnabled ? 'success' : 'warning'} size="sm">
                {user?.twoFactorEnabled ? t('enabled_status') : t('disabled_status')}
              </Badge>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xl leading-relaxed">
              {t('two_factor_card_description')}
            </p>
          </div>

          <div className="shrink-0">
            {user?.twoFactorEnabled ? (
              <Button
                variant="outline"
                size="md"
                onClick={() => setIsDisable2FAOpen(true)}
                className="text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-900 hover:bg-rose-50"
              >
                {t('disable_2fa_button')}
              </Button>
            ) : (
              <Button
                variant="primary"
                size="md"
                onClick={() => setIsSetup2FAOpen(true)}
              >
                {t('setup_2fa_button')}
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Change Password Form */}
      <section
        aria-label="Change account password"
        className="bg-white dark:bg-[#111A2E] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-6"
      >
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-[#14595A] dark:text-teal-400" aria-hidden="true" />
            <h2 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-slate-100">
              {t('change_password_title')}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {t('change_password_subtitle')}
          </p>
        </div>

        {passwordError && <FormError message={passwordError} />}

        <form onSubmit={handleSubmit(onPasswordSubmit)} className="space-y-4 max-w-lg" noValidate>
          <PasswordField
            id="current-password"
            label={t('current_password_label')}
            placeholder={t('current_password_placeholder')}
            autoComplete="current-password"
            required
            error={errors.currentPassword?.message ? t(errors.currentPassword.message) : undefined}
            {...register('currentPassword')}
          />

          <PasswordField
            id="new-password"
            label={t('new_password_label')}
            placeholder={t('password_placeholder')}
            autoComplete="new-password"
            required
            showStrengthMeter
            passwordValue={newPasswordValue}
            error={errors.newPassword?.message ? t(errors.newPassword.message) : undefined}
            {...register('newPassword')}
          />

          <PasswordField
            id="confirm-new-password"
            label={t('confirm_new_password_label')}
            placeholder={t('password_placeholder')}
            autoComplete="new-password"
            required
            error={errors.confirmNewPassword?.message ? t(errors.confirmNewPassword.message) : undefined}
            {...register('confirmNewPassword')}
          />

          <div className="pt-2">
            <Button type="submit" variant="primary" isLoading={isSubmitting}>
              {t('update_password_submit')}
            </Button>
          </div>
        </form>
      </section>

      {/* Quick Links to Sessions & Login History */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          to="/settings/sessions"
          className="group flex items-center justify-between p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111A2E] hover:border-[#14595A] dark:hover:border-teal-500/80 transition-all shadow-xs"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300 group-hover:bg-[#14595A]/10 group-hover:text-[#14595A] transition-colors">
              <Laptop className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                {t('sessions_title')}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Manage active browser sessions and devices
              </p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#14595A] group-hover:translate-x-0.5 transition-all" aria-hidden="true" />
        </Link>

        <Link
          to="/settings/history"
          className="group flex items-center justify-between p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111A2E] hover:border-[#14595A] dark:hover:border-teal-500/80 transition-all shadow-xs"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300 group-hover:bg-[#14595A]/10 group-hover:text-[#14595A] transition-colors">
              <History className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                {t('history_title')}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Audit sign-ins, IP addresses, and security events
              </p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#14595A] group-hover:translate-x-0.5 transition-all" aria-hidden="true" />
        </Link>
      </div>

      {/* Dialogs */}
      <TwoFactorSetupDialog
        isOpen={isSetup2FAOpen}
        onClose={() => setIsSetup2FAOpen(false)}
      />

      <Disable2FADialog
        isOpen={isDisable2FAOpen}
        onClose={() => setIsDisable2FAOpen(false)}
      />
    </div>
  );
};
