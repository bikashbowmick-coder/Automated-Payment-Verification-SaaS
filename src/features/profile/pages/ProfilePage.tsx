/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { User, Phone, Mail, CheckCircle2 } from 'lucide-react';
import { TextField } from '../../../components/ui/TextField.tsx';
import { Select } from '../../../components/ui/Select.tsx';
import { Button } from '../../../components/ui/Button.tsx';
import { FormError } from '../../../components/ui/FormError.tsx';
import { AvatarUploader } from '../components/AvatarUploader.tsx';
import { profileSchema, ProfileFormData } from '../../../lib/schemas.ts';
import { profileService } from '../services/profileService.ts';
import { useAuth } from '../../auth/context/AuthContext.tsx';
import { useI18n } from '../../../locales/I18nContext.tsx';
import { useToast } from '../../../components/ui/Toast.tsx';

export const ProfilePage: React.FC = () => {
  const { user, updateUserStatus } = useAuth();
  const { t, setLanguage } = useI18n();
  const { success } = useToast();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: user?.fullName || '',
      phone: user?.phone || '',
      language: user?.language || 'en',
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        fullName: user.fullName || '',
        phone: user.phone || '',
        language: user.language || 'en',
      });
    }
  }, [user, reset]);

  // Dirty form window navigation warning
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  const onSubmit = async (data: ProfileFormData) => {
    setFormError(null);
    try {
      const updated = await profileService.updateProfile({
        fullName: data.fullName,
        phone: data.phone,
        language: data.language,
      });
      updateUserStatus(updated);
      setLanguage(data.language);
      reset(data);
      success(t('toast_profile_updated'));
    } catch {
      setFormError(t('toast_generic_error'));
    }
  };

  const handleAvatarChanged = async (file: File) => {
    const newUrl = await profileService.uploadAvatar(file);
    updateUserStatus({ avatarUrl: newUrl });
  };

  const handleAvatarRemoved = async () => {
    await profileService.removeAvatar();
    updateUserStatus({ avatarUrl: '' });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          {t('profile_title')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          {t('profile_subtitle')}
        </p>
      </div>

      <div className="bg-white dark:bg-[#111A2E] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6 shadow-xs">
        {formError && <FormError message={formError} />}

        {/* Avatar Section */}
        <AvatarUploader
          currentAvatarUrl={user?.avatarUrl}
          fullName={user?.fullName}
          onAvatarChanged={handleAvatarChanged}
          onAvatarRemoved={handleAvatarRemoved}
        />

        <div className="border-t border-slate-100 dark:border-slate-800" />

        {/* Profile Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-xl">
          <TextField
            id="profile-fullname"
            label={t('full_name_label')}
            placeholder={t('full_name_placeholder')}
            required
            leftIcon={<User className="w-4 h-4" />}
            error={errors.fullName?.message ? t(errors.fullName.message) : undefined}
            {...register('fullName')}
          />

          {/* Email field (Read-only with verified status indicator) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="profile-email-readonly"
                className="text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200"
              >
                {t('email_label')}
              </label>
              {user?.emailVerified && (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>{t('verified_status')}</span>
                </span>
              )}
            </div>
            <div className="relative flex items-center">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
              <input
                id="profile-email-readonly"
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full pl-10 pr-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 rounded-lg border border-slate-200 dark:border-slate-800 cursor-not-allowed select-none"
              />
            </div>
            <p className="text-[11px] text-slate-400">
              Email changes require re-authentication and support review for merchant account safety.
            </p>
          </div>

          <TextField
            id="profile-phone"
            label={t('business_phone_label')}
            placeholder="01711223344"
            leftIcon={<Phone className="w-4 h-4" />}
            hint="Bangladesh mobile number format (e.g. 01XXXXXXXXX or +880)"
            error={errors.phone?.message ? t(errors.phone.message) : undefined}
            {...register('phone')}
          />

          <Select
            id="profile-language"
            label={t('language_toggle')}
            options={[
              { value: 'en', label: t('lang_en') },
              { value: 'bn', label: t('lang_bn') },
            ]}
            error={errors.language?.message ? t(errors.language.message) : undefined}
            {...register('language')}
          />

          <div className="pt-3">
            <Button
              type="submit"
              variant="primary"
              disabled={!isDirty}
              isLoading={isSubmitting}
            >
              {t('save_changes')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
