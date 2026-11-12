/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { Mail, CheckCircle2, RotateCw, AlertTriangle } from 'lucide-react';
import { Button } from '../../../components/ui/Button.tsx';
import { FormError } from '../../../components/ui/FormError.tsx';
import { useResendCooldown } from '../../../lib/hooks/useResendCooldown.ts';
import { authService, getStoredUser } from '../services/authService.ts';
import { useAuth } from '../context/AuthContext.tsx';
import { useToast } from '../../../components/ui/Toast.tsx';
import { useI18n } from '../../../locales/I18nContext.tsx';

export const VerifyEmailPage: React.FC = () => {
  const { t } = useI18n();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { updateUserStatus } = useAuth();
  const { success } = useToast();

  const user = getStoredUser();
  const rawEmail = (location.state as { email?: string })?.email || user.email || 'merchant@mysas.com.bd';
  const isExpiredToken = searchParams.get('expired') === 'true';

  const [isVerifying, setIsVerifying] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { secondsRemaining, canResend, reset } = useResendCooldown(60);

  // Mask email: e.g. "m***t@mysas.com.bd"
  const maskEmail = (email: string) => {
    const [userPart, domain] = email.split('@');
    if (!domain) return email;
    if (userPart.length <= 2) return `${userPart[0]}*@${domain}`;
    return `${userPart[0]}***${userPart[userPart.length - 1]}@${domain}`;
  };

  // Simulate auto-verification on clicking simulated verify button
  const handleSimulateVerification = async () => {
    setIsVerifying(true);
    setErrorMessage(null);
    try {
      await authService.verifyEmail(rawEmail);
      updateUserStatus({ emailVerified: true });
      setIsSuccess(true);
      success(t('verification_successful'));
      setTimeout(() => {
        navigate('/onboarding/create-business');
      }, 1500);
    } catch {
      setErrorMessage(t('toast_generic_error'));
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (!canResend || isResending) return;
    setIsResending(true);
    setErrorMessage(null);
    try {
      await authService.resendVerificationEmail(rawEmail);
      reset(60);
      success(t('toast_resend_sent'));
    } catch {
      setErrorMessage(t('toast_generic_error'));
    } finally {
      setIsResending(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="w-full text-center space-y-4 py-4 animate-in fade-in">
        <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8" aria-hidden="true" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
          {t('verification_successful')}
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          {t('redirecting_to_onboarding')}
        </p>
      </div>
    );
  }

  if (isExpiredToken) {
    return (
      <div className="w-full space-y-6 text-center py-2">
        <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-950/40 text-rose-600 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-6 h-6" aria-hidden="true" />
        </div>
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            {t('link_expired_title')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {t('link_expired_message')}
          </p>
        </div>
        <Button variant="primary" onClick={handleResend} isLoading={isResending} className="w-full">
          {t('request_new_link')}
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-full bg-[#14595A]/10 dark:bg-teal-900/40 text-[#14595A] dark:text-teal-300 flex items-center justify-center mx-auto mb-3">
          <Mail className="w-6 h-6" aria-hidden="true" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          {t('verify_title')}
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
          {t('verify_subtitle')}{' '}
          <strong className="font-semibold text-slate-800 dark:text-slate-200 block mt-1">
            {maskEmail(rawEmail)}
          </strong>
        </p>
      </div>

      {errorMessage && <FormError message={errorMessage} />}

      <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
        {t('verify_instruction')}
      </div>

      {/* Primary Action: Verify email & simulate email click */}
      <div className="space-y-3 pt-2">
        <Button
          variant="primary"
          size="lg"
          onClick={handleSimulateVerification}
          isLoading={isVerifying}
          className="w-full"
        >
          Confirm Email Verification
        </Button>

        <div className="text-center">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={!canResend || isResending}
            onClick={handleResend}
            leftIcon={<RotateCw className={`w-3.5 h-3.5 ${isResending ? 'animate-spin' : ''}`} />}
            className="text-xs"
          >
            {canResend
              ? t('resend_verification')
              : t('resend_countdown', { seconds: secondsRemaining })}
          </Button>

          {/* Polite screen reader live announcement */}
          <div aria-live="polite" className="sr-only">
            {canResend
              ? 'Resend verification email is now available.'
              : `Resend available in ${secondsRemaining} seconds.`}
          </div>
        </div>
      </div>
    </div>
  );
};
