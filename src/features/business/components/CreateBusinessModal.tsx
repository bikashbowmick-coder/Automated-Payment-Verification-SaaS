/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Building2, Phone, Tag } from 'lucide-react';
import { Dialog } from '../../../components/ui/Dialog.tsx';
import { TextField } from '../../../components/ui/TextField.tsx';
import { Select } from '../../../components/ui/Select.tsx';
import { Button } from '../../../components/ui/Button.tsx';
import { FormError } from '../../../components/ui/FormError.tsx';
import { businessSchema, BusinessFormData } from '../../../lib/schemas.ts';
import { BUSINESS_CATEGORIES } from '../../../lib/constants.ts';
import { useBusiness } from '../context/BusinessContext.tsx';
import { useI18n } from '../../../locales/I18nContext.tsx';

export interface CreateBusinessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateBusinessModal: React.FC<CreateBusinessModalProps> = ({ isOpen, onClose }) => {
  const { createBusiness } = useBusiness();
  const { t } = useI18n();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BusinessFormData>({
    resolver: zodResolver(businessSchema),
    defaultValues: {
      name: '',
      category: '',
      phone: '',
    },
  });

  const onSubmit = async (data: BusinessFormData) => {
    setFormError(null);
    try {
      await createBusiness({
        name: data.name,
        category: data.category,
        phone: data.phone,
      });
      reset();
      onClose();
    } catch {
      setFormError(t('toast_generic_error'));
    }
  };

  const handleClose = () => {
    reset();
    setFormError(null);
    onClose();
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={handleClose}
      title={t('create_business_modal_title')}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {formError && <FormError message={formError} />}

        <TextField
          id="modal-biz-name"
          label={t('business_name_label')}
          placeholder={t('business_name_placeholder')}
          required
          leftIcon={<Building2 className="w-4 h-4" />}
          error={errors.name?.message ? t(errors.name.message) : undefined}
          {...register('name')}
        />

        <Select
          id="modal-biz-category"
          label={t('business_category_label')}
          placeholder={t('business_category_select')}
          required
          options={[...BUSINESS_CATEGORIES]}
          error={errors.category?.message ? t(errors.category.message) : undefined}
          {...register('category')}
        />

        <TextField
          id="modal-biz-phone"
          label={t('business_phone_label')}
          placeholder={t('business_phone_placeholder')}
          leftIcon={<Phone className="w-4 h-4" />}
          hint="e.g. 01712345678 (Supports bKash/Nagad merchant queries)"
          error={errors.phone?.message ? t(errors.phone.message) : undefined}
          {...register('phone')}
        />

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <Button type="button" variant="outline" onClick={handleClose}>
            {t('cancel_action')}
          </Button>
          <Button type="submit" variant="primary" isLoading={isSubmitting}>
            {t('add_business_button')}
          </Button>
        </div>
      </form>
    </Dialog>
  );
};
