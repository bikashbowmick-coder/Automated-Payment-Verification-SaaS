/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail } from 'lucide-react';
import { TextField } from '../../../components/ui/TextField.tsx';
import { PasswordField } from '../../../components/ui/PasswordField.tsx';
import { Checkbox } from '../../../components/ui/Checkbox.tsx';
import { Button } from '../../../components/ui/Button.tsx';
import { FormError } from '../../../components/ui/FormError.tsx';
import { registerSchema, RegisterFormData } from '../../../lib/schemas.ts';
import { authService } from '../services/authService.ts';
import { useAuth } from '../context/AuthContext.tsx';
import { useI18n } from '../../../locales/I18nContext.tsx';

export const RegisterPage: React.FC = () => {
  const { t } = useI18n();
  const navigate = useNavigate();
  const { loginWithGoogle } = useAuth();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      termsAccepted: false,
    },
    mode: 'onBlur',
  });

  const passwordValue = watch('password');

  const onSubmit = async (data: RegisterFormData) => {
    setFormError(null);
    try {
      await authService.register({
        fullName: data.fullName,
        email: data.email,
        password: data.password,
      });
      navigate('/verify-email', { state: { email: data.email } });
    } catch (err: unknown) {
      if (err instanceof Error && err.message === 'DUPLICATE_EMAIL') {
        setFormError('An account with this email address already exists. Please sign in instead.');
      } else {
        setFormError(t('toast_generic_error'));
      }
    }
  };

  const handleGoogleSignUp = async () => {
    setFormError(null);
    try {
      const res = await loginWithGoogle();
      if (res.success) {
        navigate('/onboarding/create-business');
      }
    } catch {
      setFormError(t('toast_generic_error'));
    }
  };

  return (
    <div className="w-full space-y-6">
      <div className="space-y-1 text-center sm:text-left">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          {t('register_title')}
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          {t('register_subtitle')}
        </p>
      </div>

      {formError && <FormError message={formError} />}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <TextField
          id="register-fullname"
          label={t('full_name_label')}
          placeholder={t('full_name_placeholder')}
          autoComplete="name"
          required
          leftIcon={<User className="w-4 h-4" />}
          error={errors.fullName?.message ? t(errors.fullName.message) : undefined}
          {...register('fullName')}
        />

        <TextField
          id="register-email"
          label={t('email_label')}
          type="email"
          placeholder={t('email_placeholder')}
          autoComplete="email"
          required
          leftIcon={<Mail className="w-4 h-4" />}
          error={errors.email?.message ? t(errors.email.message) : undefined}
          {...register('email')}
        />

        <PasswordField
          id="register-password"
          label={t('password_label')}
          placeholder={t('password_placeholder')}
          autoComplete="new-password"
          required
          showStrengthMeter
          passwordValue={passwordValue}
          error={errors.password?.message ? t(errors.password.message) : undefined}
          {...register('password')}
        />

        <PasswordField
          id="register-confirm-password"
          label={t('confirm_password_label')}
          placeholder={t('confirm_password_placeholder')}
          autoComplete="new-password"
          required
          error={errors.confirmPassword?.message ? t(errors.confirmPassword.message) : undefined}
          {...register('confirmPassword')}
        />

        <Checkbox
          id="register-terms"
          label={t('terms_agreement')}
          error={errors.termsAccepted?.message ? t(errors.termsAccepted.message) : undefined}
          {...register('termsAccepted')}
        />

        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={isSubmitting}
          className="w-full mt-2"
        >
          {t('register_submit')}
        </Button>
      </form>

      <div className="relative flex items-center justify-center">
        <div className="w-full border-t border-slate-200 dark:border-slate-800" />
        <span className="absolute px-3 bg-white dark:bg-[#111A2E] text-xs text-slate-400">
          {t('or_divider')}
        </span>
      </div>

      <Button
        type="button"
        variant="outline"
        size="md"
        onClick={handleGoogleSignUp}
        className="w-full flex items-center justify-center gap-2.5"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="#4285F4"
            d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
          />
          <path
            fill="#34A853"
            d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.35 24 12 24z"
          />
          <path
            fill="#FBBC05"
            d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
          />
          <path
            fill="#EA4335"
            d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
          />
        </svg>
        <span>{t('sign_up_google')}</span>
      </Button>

      <div className="text-center text-xs text-slate-500 dark:text-slate-400">
        <span>{t('have_account')} </span>
        <Link
          to="/login"
          className="font-semibold text-[#14595A] dark:text-teal-400 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#4F46E5]"
        >
          {t('sign_in_link')}
        </Link>
      </div>
    </div>
  );
};
