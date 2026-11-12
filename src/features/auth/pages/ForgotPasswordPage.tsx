/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { Mail, CheckCircle2, ArrowLeft } from 'lucide-react';
import { TextField } from '../../../components/ui/TextField.tsx';
import { Button } from '../../../components/ui/Button.tsx';
import { forgotPasswordSchema, ForgotPasswordFormData } from '../../../lib/schemas.ts';
import { authService } from '../services/authService.ts';
import { useI18n } from '../../../locales/I18nContext.tsx';

export const ForgotPasswordPage: React.FC = () => {
  const { t } = useI18n();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    await authService.requestPasswordReset(data.email);
    // Always show same neutral confirmation (anti-account enumeration)
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="w-full space-y-5 text-center py-2 animate-in fade-in">
        <div className="w-12 h-12 rounded-full bg-teal-100 dark:bg-teal-950/50 text-[#14595A] dark:text-teal-400 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-6 h-6" aria-hidden="true" />
        </div>
        <div className="space-y-1.5">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            {t('forgot_confirmation_title')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {t('forgot_confirmation_body')}
          </p>
        </div>
        <div className="pt-2">
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
  }

  return (
    <div className="w-full space-y-6">
      <div className="space-y-1 text-center sm:text-left">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          {t('forgot_title')}
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          {t('forgot_subtitle')}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <TextField
          id="forgot-email"
          label={t('email_label')}
          type="email"
          placeholder={t('email_placeholder')}
          autoComplete="email"
          required
          leftIcon={<Mail className="w-4 h-4" />}
          error={errors.email?.message ? t(errors.email.message) : undefined}
          {...register('email')}
        />

        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={isSubmitting}
          className="w-full mt-2"
        >
          {t('forgot_submit')}
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
