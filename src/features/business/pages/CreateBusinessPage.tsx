/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { Building2, Phone, Sparkles } from 'lucide-react';
import { TextField } from '../../../components/ui/TextField.tsx';
import { Select } from '../../../components/ui/Select.tsx';
import { Button } from '../../../components/ui/Button.tsx';
import { FormError } from '../../../components/ui/FormError.tsx';
import { businessSchema, BusinessFormData } from '../../../lib/schemas.ts';
import { BUSINESS_CATEGORIES } from '../../../lib/constants.ts';
import { useBusiness } from '../context/BusinessContext.tsx';
import { useI18n } from '../../../locales/I18nContext.tsx';

export const CreateBusinessPage: React.FC = () => {
  const { t } = useI18n();
  const navigate = useNavigate();
  const { createBusiness } = useBusiness();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<BusinessFormData>({
    resolver: zodResolver(businessSchema),
    defaultValues: {
      name: '',
      category: '',
      phone: '',
    },
    mode: 'onBlur',
  });

  const onSubmit = async (data: BusinessFormData) => {
    setFormError(null);
    try {
      await createBusiness({
        name: data.name,
        category: data.category,
        phone: data.phone,
      });
      navigate('/settings/profile');
    } catch {
      setFormError(t('toast_generic_error'));
    }
  };

  return (
    <div className="w-full space-y-6">
      <div className="space-y-1.5 text-center sm:text-left">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#14595A]/10 dark:bg-teal-900/40 text-[#14595A] dark:text-teal-300 text-xs font-semibold mb-1">
          <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Onboarding Step 1 of 1</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          {t('onboarding_title')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          {t('onboarding_subtitle')}
        </p>
      </div>

      {formError && <FormError message={formError} />}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <TextField
          id="onboard-name"
          label={t('business_name_label')}
          placeholder={t('business_name_placeholder')}
          required
          leftIcon={<Building2 className="w-4 h-4" />}
          error={errors.name?.message ? t(errors.name.message) : undefined}
          {...register('name')}
        />

        <Select
          id="onboard-category"
          label={t('business_category_label')}
          placeholder={t('business_category_select')}
          required
          options={[...BUSINESS_CATEGORIES]}
          error={errors.category?.message ? t(errors.category.message) : undefined}
          {...register('category')}
        />

        <TextField
          id="onboard-phone"
          label={t('business_phone_label')}
          placeholder={t('business_phone_placeholder')}
          leftIcon={<Phone className="w-4 h-4" />}
          hint="Bangladesh format (e.g. 01712345678). Used for payment reconciliation alerts."
          error={errors.phone?.message ? t(errors.phone.message) : undefined}
          {...register('phone')}
        />

        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={isSubmitting}
          className="w-full mt-2"
        >
          {t('onboarding_submit')}
        </Button>
      </form>
    </div>
  );
};
