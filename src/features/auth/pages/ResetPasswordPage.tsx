/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { AlertTriangle, ArrowLeft } from 'lucide-react';
import { PasswordField } from '../../../components/ui/PasswordField.tsx';
import { Button } from '../../../components/ui/Button.tsx';
import { FormError } from '../../../components/ui/FormError.tsx';
import { resetPasswordSchema, ResetPasswordFormData } from '../../../lib/schemas.ts';
import { authService } from '../services/authService.ts';
import { useToast } from '../../../components/ui/Toast.tsx';
import { useI18n } from '../../../locales/I18nContext.tsx';

export const ResetPasswordPage: React.FC = () => {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { success } = useToast();

  const token = searchParams.get('token') || 'demo_token';
  const isExpiredToken = token === 'expired';

  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: '', confirmPassword: '' },
    mode: 'onBlur',
  });

  const passwordValue = watch('password');

  const onSubmit = async (data: ResetPasswordFormData) => {
    setFormError(null);
    try {
      await authService.resetPassword(token, data.password);
      success(t('toast_password_changed'));
      navigate('/login');
    } catch {
      setFormError(t('toast_generic_error'));
    }
  };

  if (isExpiredToken) {
    return (
      <div className="w-full space-y-6 text-center py-2 animate-in fade-in">
        <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-950/40 text-rose-600 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-6 h-6" aria-hidden="true" />
        </div>
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            {t('token_expired_title')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {t('token_expired_body')}
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => navigate('/forgot-password')}
          className="w-full"
        >
          {t('request_new_link')}
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <div className="space-y-1 text-center sm:text-left">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          {t('reset_title')}
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          {t('reset_subtitle')}
        </p>
      </div>

      {formError && <FormError message={formError} />}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <PasswordField
          id="reset-password"
          label={t('new_password_label')}
          placeholder={t('password_placeholder')}
          autoComplete="new-password"
          required
          showStrengthMeter
          passwordValue={passwordValue}
          error={errors.password?.message ? t(errors.password.message) : undefined}
          {...register('password')}
        />

        <PasswordField
          id="reset-confirm-password"
          label={t('confirm_new_password_label')}
          placeholder={t('password_placeholder')}
          autoComplete="new-password"
          required
          error={errors.confirmPassword?.message ? t(errors.confirmPassword.message) : undefined}
          {...register('confirmPassword')}
        />

        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={isSubmitting}
          className="w-full mt-2"
        >
          {t('reset_submit')}
        </Button>
      </form>

      <div className="text-center pt-2">
        <Link
          to="/login"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#14595A] dark:text-teal-400 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#4F46E5]"
        >
          <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
          <span>{t('back_to_login')}</span>
        </Link>
      </div>
    </div>
  );
};
