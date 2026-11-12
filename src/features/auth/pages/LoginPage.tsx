/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, AlertCircle, ShieldAlert } from 'lucide-react';
import { TextField } from '../../../components/ui/TextField.tsx';
import { PasswordField } from '../../../components/ui/PasswordField.tsx';
import { Checkbox } from '../../../components/ui/Checkbox.tsx';
import { Button } from '../../../components/ui/Button.tsx';
import { FormError } from '../../../components/ui/FormError.tsx';
import { loginSchema, LoginFormData } from '../../../lib/schemas.ts';
import { authService } from '../services/authService.ts';
import { useAuth } from '../context/AuthContext.tsx';
import { useI18n } from '../../../locales/I18nContext.tsx';

export const LoginPage: React.FC = () => {
  const { t } = useI18n();
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loginWithGoogle } = useAuth();

  const [formError, setFormError] = useState<string | null>(null);
  const [lockoutSeconds, setLockoutSeconds] = useState<number>(0);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'merchant@mysas.com.bd',
      password: '',
      rememberDevice: false,
    },
    mode: 'onBlur',
  });

  // Check lockout on load
  useEffect(() => {
    const status = authService.getLockoutStatus();
    if (status.isLocked) {
      setLockoutSeconds(status.secondsRemaining);
    }
  }, []);

  // Lockout countdown timer
  useEffect(() => {
    if (lockoutSeconds <= 0) return;
    const interval = setInterval(() => {
      setLockoutSeconds((prev) => {
        if (prev <= 1) {
          authService.clearFailedAttempts();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [lockoutSeconds]);

  const onSubmit = async (data: LoginFormData) => {
    if (lockoutSeconds > 0) return;
    setFormError(null);

    try {
      const result = await login({ email: data.email, password: data.password });

      if (!result.success) {
        if (result.isSuspended) {
          navigate('/suspended');
          return;
        }
        if (result.unverifiedEmail) {
          navigate('/verify-email', { state: { email: data.email } });
          return;
        }
        if (result.cooldownRemaining && result.cooldownRemaining > 0) {
          setLockoutSeconds(result.cooldownRemaining);
          setFormError(t('cooldown_error', { seconds: result.cooldownRemaining }));
          return;
        }
        // Generic error: never reveal whether email or password is the issue
        setFormError(t('generic_login_error'));
        return;
      }

      if (result.requires2FA) {
        navigate('/2fa-challenge', { state: { email: data.email } });
        return;
      }

      // Successful login
      const target = (location.state as { from?: { pathname: string } })?.from?.pathname || '/settings/profile';
      navigate(target);
    } catch {
      setFormError(t('generic_login_error'));
    }
  };

  const handleGoogleSignIn = async () => {
    setFormError(null);
    try {
      const res = await loginWithGoogle();
      if (res.success) {
        const target = (location.state as { from?: { pathname: string } })?.from?.pathname || '/settings/profile';
        navigate(target);
      }
    } catch {
      setFormError(t('toast_generic_error'));
    }
  };

  return (
    <div className="w-full space-y-6">
      <div className="space-y-1 text-center sm:text-left">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          {t('login_title')}
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          {t('login_subtitle')}
        </p>
      </div>

      {lockoutSeconds > 0 ? (
        <div
          role="alert"
          aria-live="assertive"
          className="flex items-start gap-3 p-4 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/30 text-rose-800 dark:text-rose-200 text-xs sm:text-sm animate-in fade-in"
        >
          <ShieldAlert className="w-5 h-5 shrink-0 text-rose-600 dark:text-rose-400 mt-0.5" />
          <div>
            <strong className="font-semibold block mb-0.5">Brute-Force Lockout Active</strong>
            <p className="leading-relaxed">
              {t('cooldown_error', { seconds: lockoutSeconds })}
            </p>
          </div>
        </div>
      ) : (
        formError && <FormError message={formError} />
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <TextField
          id="login-email"
          label={t('email_label')}
          type="email"
          placeholder={t('email_placeholder')}
          autoComplete="email"
          required
          leftIcon={<Mail className="w-4 h-4" />}
          error={errors.email?.message ? t(errors.email.message) : undefined}
          {...register('email')}
        />

        <div>
          <PasswordField
            id="login-password"
            label={t('password_label')}
            placeholder={t('password_placeholder')}
            autoComplete="current-password"
            required
            error={errors.password?.message ? t(errors.password.message) : undefined}
            {...register('password')}
          />
          <div className="flex justify-end mt-1.5">
            <Link
              to="/forgot-password"
              className="text-xs font-medium text-[#14595A] dark:text-teal-400 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#4F46E5]"
            >
              {t('forgot_password_link')}
            </Link>
          </div>
        </div>

        <Checkbox
          id="login-remember"
          label={t('remember_device')}
          {...register('rememberDevice')}
        />

        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={lockoutSeconds > 0}
          isLoading={isSubmitting}
          className="w-full mt-2"
        >
          {t('login_submit')}
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
        onClick={handleGoogleSignIn}
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
        <span>{t('sign_in_google')}</span>
      </Button>

      <div className="text-center text-xs text-slate-500 dark:text-slate-400">
        <span>{t('no_account')} </span>
        <Link
          to="/register"
          className="font-semibold text-[#14595A] dark:text-teal-400 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#4F46E5]"
        >
          {t('create_account_link')}
        </Link>
      </div>
    </div>
  );
};
