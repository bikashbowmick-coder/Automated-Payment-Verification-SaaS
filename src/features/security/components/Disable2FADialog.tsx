/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertTriangle, Lock } from 'lucide-react';
import { Dialog } from '../../../components/ui/Dialog.tsx';
import { PasswordField } from '../../../components/ui/PasswordField.tsx';
import { OtpInput } from '../../../components/ui/OtpInput.tsx';
import { Button } from '../../../components/ui/Button.tsx';
import { FormError } from '../../../components/ui/FormError.tsx';
import { disable2FASchema, Disable2FAFormData } from '../../../lib/schemas.ts';
import { authService } from '../../auth/services/authService.ts';
import { useAuth } from '../../auth/context/AuthContext.tsx';
import { useToast } from '../../../components/ui/Toast.tsx';
import { useI18n } from '../../../locales/I18nContext.tsx';

export interface Disable2FADialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Disable2FADialog: React.FC<Disable2FADialogProps> = ({ isOpen, onClose }) => {
  const { t } = useI18n();
  const { success } = useToast();
  const { updateUserStatus } = useAuth();
  const [otp, setOtp] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<Disable2FAFormData>({
    resolver: zodResolver(disable2FASchema),
    defaultValues: { password: '', currentOtp: '' },
  });

  const handleOtpChange = (val: string) => {
    setOtp(val);
    setValue('currentOtp', val, { shouldValidate: true });
  };

  const onSubmit = async (data: Disable2FAFormData) => {
    setFormError(null);
    try {
      await authService.disable2FA(data.password, data.currentOtp);
      updateUserStatus({ twoFactorEnabled: false });
      success(t('toast_2fa_disabled'));
      reset();
      setOtp('');
      onClose();
    } catch {
      setFormError('Authentication failed. Check your password and current 6-digit code.');
    }
  };

  const handleClose = () => {
    reset();
    setOtp('');
    setFormError(null);
    onClose();
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={handleClose}
      title={t('disable_2fa_modal_title')}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="flex items-start gap-2.5 p-3 rounded-lg bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 text-xs text-rose-800 dark:text-rose-300">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
          <span>{t('disable_2fa_modal_desc')}</span>
        </div>

        {formError && <FormError message={formError} />}

        <PasswordField
          id="disable-2fa-password"
          label={t('current_password_label')}
          placeholder={t('password_placeholder')}
          autoComplete="current-password"
          required
          error={errors.password?.message ? t(errors.password.message) : undefined}
          {...register('password')}
        />

        <div className="space-y-2">
          <label className="text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200 block text-center">
            {t('otp_label')}
          </label>
          <OtpInput
            value={otp}
            onChange={handleOtpChange}
            error={errors.currentOtp?.message ? t(errors.currentOtp.message) : undefined}
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <Button type="button" variant="outline" onClick={handleClose}>
            {t('cancel_action')}
          </Button>
          <Button
            type="submit"
            variant="danger"
            isLoading={isSubmitting}
            disabled={otp.length !== 6}
          >
            {t('disable_2fa_button')}
          </Button>
        </div>
      </form>
    </Dialog>
  );
};
