/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  AlertTriangle,
  ShieldAlert,
  Clock,
  RotateCcw,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { TextField } from '../../../components/ui/TextField.tsx';
import { PasswordField } from '../../../components/ui/PasswordField.tsx';
import { OtpInput } from '../../../components/ui/OtpInput.tsx';
import { Button } from '../../../components/ui/Button.tsx';
import { FormError } from '../../../components/ui/FormError.tsx';
import { deleteAccountSchema, DeleteAccountFormData } from '../../../lib/schemas.ts';
import { useAuth } from '../../auth/context/AuthContext.tsx';
import { useI18n } from '../../../locales/I18nContext.tsx';
import { useToast } from '../../../components/ui/Toast.tsx';
import { ACCOUNT_DELETION_GRACE_DAYS } from '../../../lib/constants.ts';

export const DeleteAccountPage: React.FC = () => {
  const { t, formatDate } = useI18n();
  const { user, updateUserStatus } = useAuth();
  const { success } = useToast();

  const [wizardStep, setWizardStep] = useState<1 | 2 | 3 | 4>(1);
  const [formError, setFormError] = useState<string | null>(null);
  const [otpCode, setOtpCode] = useState('');

  const targetEmail = user?.email || 'merchant@mysas.com.bd';
  const requires2FA = Boolean(user?.twoFactorEnabled);

  const schema = React.useMemo(
    () => deleteAccountSchema(targetEmail, requires2FA),
    [targetEmail, requires2FA]
  );

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<DeleteAccountFormData>({
    resolver: zodResolver(schema),
    defaultValues: { confirmation: '', password: '', otpCode: '' },
    mode: 'onBlur',
  });

  const isAlreadyPending = user?.status === 'pending_deletion';

  const handleCancelPending = () => {
    updateUserStatus({
      status: 'active',
      deletionScheduledAt: undefined,
    });
    success(t('toast_deletion_cancelled'));
  };

  const onSubmit = async () => {
    setFormError(null);
    try {
      // Simulate deletion request processing
      await new Promise((r) => setTimeout(r, 600));

      const scheduledDate = new Date(
        Date.now() + ACCOUNT_DELETION_GRACE_DAYS * 24 * 60 * 60 * 1000
      ).toISOString();

      updateUserStatus({
        status: 'pending_deletion',
        deletionScheduledAt: scheduledDate,
      });

      setWizardStep(4); // Confirmation screen
      success(t('toast_deletion_requested'));
    } catch {
      setFormError(t('toast_generic_error'));
    }
  };

  if (isAlreadyPending) {
    const scheduledDate = user.deletionScheduledAt
      ? formatDate(user.deletionScheduledAt, { dateStyle: 'full' })
      : 'in 14 days';

    return (
      <div className="space-y-6">
        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            {t('delete_title')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {t('delete_subtitle')}
          </p>
        </div>

        <div className="p-6 sm:p-8 rounded-2xl border border-amber-300 dark:border-amber-800 bg-amber-50/70 dark:bg-amber-950/20 space-y-4">
          <div className="flex items-start gap-3">
            <Clock className="w-6 h-6 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h2 className="text-base sm:text-lg font-bold text-amber-900 dark:text-amber-100">
                {t('pending_deletion_banner_title')}
              </h2>
              <p className="text-xs sm:text-sm text-amber-800 dark:text-amber-200 leading-relaxed">
                {t('pending_deletion_banner_desc', { date: scheduledDate })}
              </p>
            </div>
          </div>

          <div className="pt-2">
            <Button
              variant="primary"
              onClick={handleCancelPending}
              leftIcon={<RotateCcw className="w-4 h-4" />}
            >
              {t('cancel_deletion_btn')}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="space-y-1">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-rose-600 dark:text-rose-400">
          {t('delete_title')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          {t('delete_subtitle')}
        </p>
      </div>

      {formError && <FormError message={formError} />}

      {/* STEP 1: Understand deletion, grace period, data retention */}
      {wizardStep === 1 && (
        <div className="p-6 sm:p-8 rounded-2xl border border-rose-200 dark:border-rose-900/60 bg-white dark:bg-[#111A2E] space-y-5 shadow-xs animate-in fade-in">
          <div className="flex items-center gap-2.5 text-rose-600 dark:text-rose-400 font-bold text-sm sm:text-base">
            <AlertTriangle className="w-5 h-5 shrink-0" aria-hidden="true" />
            <span>{t('delete_step1_title')}</span>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {t('delete_step1_desc')}
          </p>

          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 text-xs text-slate-600 dark:text-slate-400 space-y-2">
            <strong className="text-slate-900 dark:text-slate-200 block font-semibold">
              Compliance & Audit Retention Note:
            </strong>
            <p className="leading-relaxed">
              {t('delete_retention_note')}
            </p>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button variant="danger" onClick={() => setWizardStep(2)}>
              {t('delete_proceed_btn')}
            </Button>
          </div>
        </div>
      )}

      {/* STEP 2 & 3: Type DELETE / email + enter password & 2FA */}
      {(wizardStep === 2 || wizardStep === 3) && (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="p-6 sm:p-8 rounded-2xl border border-rose-200 dark:border-rose-900/60 bg-white dark:bg-[#111A2E] space-y-5 shadow-xs animate-in fade-in"
        >
          {wizardStep === 2 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2.5 text-rose-600 dark:text-rose-400 font-bold text-sm sm:text-base">
                <AlertTriangle className="w-5 h-5 shrink-0" aria-hidden="true" />
                <span>{t('delete_step2_title')}</span>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                {t('delete_step2_desc', { email: targetEmail })}
              </p>

              <TextField
                id="delete-confirmation-input"
                label="Confirmation word or email"
                placeholder="DELETE"
                required
                error={errors.confirmation?.message ? t(errors.confirmation.message) : undefined}
                {...register('confirmation')}
              />

              <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                <Button variant="outline" onClick={() => setWizardStep(1)}>
                  Back
                </Button>
                <Button variant="danger" onClick={() => setWizardStep(3)}>
                  Next: Verify Credentials
                </Button>
              </div>
            </div>
          )}

          {wizardStep === 3 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2.5 text-rose-600 dark:text-rose-400 font-bold text-sm sm:text-base">
                <Lock className="w-5 h-5 shrink-0" aria-hidden="true" />
                <span>{t('delete_step3_title')}</span>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                {t('delete_step3_desc')}
              </p>

              <PasswordField
                id="delete-verify-password"
                label={t('current_password_label')}
                placeholder={t('password_placeholder')}
                autoComplete="current-password"
                required
                error={errors.password?.message ? t(errors.password.message) : undefined}
                {...register('password')}
              />

              {requires2FA && (
                <div className="space-y-2 pt-2">
                  <label className="text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200 block text-center">
                    {t('otp_label')} (2FA Enabled)
                  </label>
                  <OtpInput
                    value={otpCode}
                    onChange={(val) => {
                      setOtpCode(val);
                      setValue('otpCode', val, { shouldValidate: true });
                    }}
                    error={errors.otpCode?.message ? t(errors.otpCode.message) : undefined}
                  />
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                <Button variant="outline" onClick={() => setWizardStep(2)}>
                  Back
                </Button>
                <Button
                  type="submit"
                  variant="danger"
                  isLoading={isSubmitting}
                  disabled={requires2FA && otpCode.length !== 6}
                >
                  {t('delete_request_submit')}
                </Button>
              </div>
            </div>
          )}
        </form>
      )}

      {/* STEP 4: Completed confirmation screen */}
      {wizardStep === 4 && (
        <div className="p-6 sm:p-8 rounded-2xl border border-amber-300 dark:border-amber-800 bg-amber-50/60 dark:bg-amber-950/20 text-center space-y-4 animate-in fade-in">
          <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-amber-900 dark:text-amber-100">
            {t('pending_deletion_banner_title')}
          </h2>
          <p className="text-xs sm:text-sm text-amber-800 dark:text-amber-200 max-w-md mx-auto leading-relaxed">
            Your request has been registered. You have 14 days to cancel if you change your mind.
          </p>
          <Button variant="primary" onClick={handleCancelPending} leftIcon={<RotateCcw className="w-3.5 h-3.5" />}>
            {t('cancel_deletion_btn')}
          </Button>
        </div>
      )}
    </div>
  );
};
