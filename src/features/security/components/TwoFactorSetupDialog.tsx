/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Download, Check, ShieldCheck, Key, AlertTriangle } from 'lucide-react';
import { Dialog } from '../../../components/ui/Dialog.tsx';
import { Button } from '../../../components/ui/Button.tsx';
import { OtpInput } from '../../../components/ui/OtpInput.tsx';
import { CopyButton } from '../../../components/ui/CopyButton.tsx';
import { Checkbox } from '../../../components/ui/Checkbox.tsx';
import { FormError } from '../../../components/ui/FormError.tsx';
import { authService } from '../../auth/services/authService.ts';
import { TwoFactorSetupData } from '../../../lib/types.ts';
import { useAuth } from '../../auth/context/AuthContext.tsx';
import { useToast } from '../../../components/ui/Toast.tsx';
import { useI18n } from '../../../locales/I18nContext.tsx';

export interface TwoFactorSetupDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TwoFactorSetupDialog: React.FC<TwoFactorSetupDialogProps> = ({ isOpen, onClose }) => {
  const { t } = useI18n();
  const { success } = useToast();
  const { updateUserStatus } = useAuth();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [setupData, setSetupData] = useState<TwoFactorSetupData | null>(null);
  const [otp, setOtp] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [hasSavedCodes, setHasSavedCodes] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setOtp('');
      setHasSavedCodes(false);
      setError(null);
      authService.setup2FA().then(setSetupData);
    }
  }, [isOpen]);

  const handleVerifyOtp = async (codeToVerify?: string) => {
    const code = codeToVerify || otp;
    if (code.length !== 6) return;
    setIsVerifying(true);
    setError(null);
    try {
      await authService.confirm2FASetup(code);
      setStep(3); // advance to backup codes
    } catch {
      setError('Invalid code. Please check your authenticator application.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleDownloadBackupCodes = () => {
    if (!setupData) return;
    const content = `MY SAS TWO-FACTOR RECOVERY BACKUP CODES\nGenerated: ${new Date().toISOString()}\n\n` +
      setupData.backupCodes.map((c, i) => `${i + 1}. ${c}`).join('\n') +
      `\n\nKeep these codes offline. Each code can only be used once.`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mysas-backup-codes-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFinish = () => {
    updateUserStatus({ twoFactorEnabled: true });
    success(t('toast_2fa_enabled'));
    onClose();
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={t('setup_2fa_dialog_title')}
      maxWidth="md"
    >
      <div className="space-y-6">
        {/* Step indicator */}
        <div className="flex items-center justify-between text-xs border-b border-slate-100 dark:border-slate-800 pb-3">
          <span className={`font-semibold ${step >= 1 ? 'text-[#14595A] dark:text-teal-400' : 'text-slate-400'}`}>
            1. Scan QR
          </span>
          <span className="text-slate-300 dark:text-slate-700">→</span>
          <span className={`font-semibold ${step >= 2 ? 'text-[#14595A] dark:text-teal-400' : 'text-slate-400'}`}>
            2. Verify Code
          </span>
          <span className="text-slate-300 dark:text-slate-700">→</span>
          <span className={`font-semibold ${step >= 3 ? 'text-[#14595A] dark:text-teal-400' : 'text-slate-400'}`}>
            3. Backup Codes
          </span>
        </div>

        {error && <FormError message={error} />}

        {/* STEP 1: Scan QR or manual key */}
        {step === 1 && (
          <div className="space-y-4 text-center">
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              {t('step1_desc')}
            </p>

            {/* QR Code Container */}
            <div className="flex justify-center my-2">
              <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white inline-block shadow-xs">
                {setupData?.qrCodeUrl && (
                  <img
                    src={setupData.qrCodeUrl}
                    alt="Authenticator QR barcode"
                    className="w-44 h-44 object-contain"
                  />
                )}
              </div>
            </div>

            {/* Manual Secret Key */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2 text-left">
              <div>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                  {t('manual_key_label')}
                </span>
                <span className="font-mono text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 tracking-wider">
                  {setupData?.manualKey}
                </span>
              </div>
              {setupData && <CopyButton textToCopy={setupData.manualKey} label={t('copy_key')} />}
            </div>

            <Button variant="primary" onClick={() => setStep(2)} className="w-full mt-4">
              Next: Verify 6-digit Code
            </Button>
          </div>
        )}

        {/* STEP 2: Enter 6-digit OTP to confirm */}
        {step === 2 && (
          <div className="space-y-6 text-center">
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              {t('step2_desc')}
            </p>

            <OtpInput
              value={otp}
              onChange={setOtp}
              onComplete={(val) => handleVerifyOtp(val)}
              disabled={isVerifying}
            />

            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                Back
              </Button>
              <Button
                variant="primary"
                onClick={() => handleVerifyOtp()}
                isLoading={isVerifying}
                disabled={otp.length !== 6}
                className="flex-1"
              >
                Verify & Next
              </Button>
            </div>
          </div>
        )}

        {/* STEP 3: Backup recovery codes */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 text-xs text-amber-800 dark:text-amber-300">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{t('backup_codes_notice')}</span>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              {t('step3_desc')}
            </p>

            {/* Grid of 8 single-use codes */}
            <div className="grid grid-cols-2 gap-2 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 font-mono text-xs font-semibold text-slate-900 dark:text-slate-100 text-center">
              {setupData?.backupCodes.map((code, idx) => (
                <div key={idx} className="p-1.5 rounded bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                  {code}
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleDownloadBackupCodes}
                leftIcon={<Download className="w-3.5 h-3.5" />}
              >
                {t('download_backup_codes')}
              </Button>
              {setupData && (
                <CopyButton
                  textToCopy={setupData.backupCodes.join('\n')}
                  label={t('copy_all_codes')}
                />
              )}
            </div>

            <div className="pt-2">
              <Checkbox
                id="saved-codes-confirm"
                label={t('saved_codes_confirmation')}
                checked={hasSavedCodes}
                onChange={(e) => setHasSavedCodes(e.target.checked)}
              />
            </div>

            <Button
              variant="primary"
              onClick={handleFinish}
              disabled={!hasSavedCodes}
              className="w-full mt-2"
            >
              {t('finish_2fa_setup')}
            </Button>
          </div>
        )}
      </div>
    </Dialog>
  );
};
