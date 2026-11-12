/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck, KeyRound, AlertTriangle } from 'lucide-react';
import { OtpInput } from '../../../components/ui/OtpInput.tsx';
import { TextField } from '../../../components/ui/TextField.tsx';
import { Button } from '../../../components/ui/Button.tsx';
import { FormError } from '../../../components/ui/FormError.tsx';
import { useAuth } from '../context/AuthContext.tsx';
import { useI18n } from '../../../locales/I18nContext.tsx';

export const TwoFactorChallengePage: React.FC = () => {
  const { t } = useI18n();
  const navigate = useNavigate();
  const location = useLocation();
  const { verify2FA } = useAuth();

  const [otp, setOtp] = useState('');
  const [backupCode, setBackupCode] = useState('');
  const [useBackup, setUseBackup] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleVerify = async (codeToVerify?: string) => {
    const finalCode = codeToVerify || (useBackup ? backupCode : otp);
    if (!finalCode) return;

    setIsVerifying(true);
    setErrorMessage(null);

    try {
      await verify2FA(finalCode, useBackup);
      const target = (location.state as { from?: { pathname: string } })?.from?.pathname || '/settings/profile';
      navigate(target);
    } catch {
      setErrorMessage(
        useBackup
          ? 'Invalid or previously used backup code. Please check and try again.'
          : 'Invalid 6-digit code. Please verify the code in your authenticator app.'
      );
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-full bg-[#14595A]/10 dark:bg-teal-900/40 text-[#14595A] dark:text-teal-300 flex items-center justify-center mx-auto mb-3">
          <ShieldCheck className="w-6 h-6" aria-hidden="true" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          {t('two_factor_title')}
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
          {useBackup
            ? 'Enter one of your 8-digit emergency backup recovery codes.'
            : t('two_factor_subtitle')}
        </p>
      </div>

      {errorMessage && <FormError message={errorMessage} />}

      {!useBackup ? (
        <div className="space-y-6">
          <OtpInput
            value={otp}
            onChange={setOtp}
            onComplete={(val) => handleVerify(val)}
            disabled={isVerifying}
          />

          <Button
            type="button"
            variant="primary"
            size="lg"
            isLoading={isVerifying}
            disabled={otp.length !== 6}
            onClick={() => handleVerify()}
            className="w-full"
          >
            {t('otp_submit')}
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <TextField
            id="backup-code-input"
            label={t('backup_code_label')}
            placeholder={t('backup_code_placeholder')}
            value={backupCode}
            onChange={(e) => setBackupCode(e.target.value.toUpperCase())}
            leftIcon={<KeyRound className="w-4 h-4" />}
            autoComplete="one-time-code"
          />

          <Button
            type="button"
            variant="primary"
            size="lg"
            isLoading={isVerifying}
            disabled={backupCode.trim().length < 6}
            onClick={() => handleVerify()}
            className="w-full"
          >
            {t('backup_code_submit')}
          </Button>
        </div>
      )}

      {/* Backup code toggle */}
      <div className="text-center pt-2">
        <button
          type="button"
          onClick={() => {
            setUseBackup(!useBackup);
            setErrorMessage(null);
          }}
          className="text-xs font-medium text-[#14595A] dark:text-teal-400 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#4F46E5]"
        >
          {useBackup ? t('use_authenticator') : t('use_backup_code')}
        </button>
      </div>

      {/* Rate limit warning footer */}
      <div className="flex items-center gap-1.5 p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 text-[11px] text-amber-800 dark:text-amber-300">
        <AlertTriangle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
        <span>{t('rate_limit_warning')}</span>
      </div>
    </div>
  );
};
