/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { z } from 'zod';
import { BANGLADESH_PHONE_REGEX } from './constants.ts';

export const registerSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(2, { message: 'validation_name_min' })
      .max(60, { message: 'validation_name_max' }),
    email: z
      .string()
      .trim()
      .email({ message: 'validation_email_invalid' })
      .toLowerCase(),
    password: z
      .string()
      .min(8, { message: 'validation_password_min' }),
    confirmPassword: z.string(),
    termsAccepted: z
      .boolean()
      .refine((val) => val === true, { message: 'validation_terms_required' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'validation_passwords_mismatch',
    path: ['confirmPassword'],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .email({ message: 'validation_email_invalid' })
    .toLowerCase(),
  password: z
    .string()
    .min(1, { message: 'validation_password_required' }),
  rememberDevice: z.boolean(),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .email({ message: 'validation_email_invalid' })
    .toLowerCase(),
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: 'validation_password_min' }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'validation_passwords_mismatch',
    path: ['confirmPassword'],
  });

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, { message: 'validation_current_password_required' }),
    newPassword: z
      .string()
      .min(8, { message: 'validation_password_min' }),
    confirmNewPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: 'validation_passwords_mismatch',
    path: ['confirmNewPassword'],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: 'validation_new_password_same',
    path: ['newPassword'],
  });

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

export const profileSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, { message: 'validation_name_min' })
    .max(60, { message: 'validation_name_max' }),
  phone: z
    .string()
    .trim()
    .optional()
    .refine(
      (val) => !val || BANGLADESH_PHONE_REGEX.test(val),
      { message: 'validation_phone_bangladesh' }
    ),
  language: z.enum(['en', 'bn']),
});

export type ProfileFormData = z.infer<typeof profileSchema>;

export const businessSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: 'validation_business_name_min' })
    .max(80, { message: 'validation_business_name_max' }),
  category: z
    .string()
    .min(1, { message: 'validation_category_required' }),
  phone: z
    .string()
    .trim()
    .optional()
    .refine(
      (val) => !val || BANGLADESH_PHONE_REGEX.test(val),
      { message: 'validation_phone_bangladesh' }
    ),
  logoUrl: z.string().optional(),
});

export type BusinessFormData = z.infer<typeof businessSchema>;

export const twoFactorOtpSchema = z.object({
  otp: z
    .string()
    .length(6, { message: 'validation_otp_length' })
    .regex(/^\d+$/, { message: 'validation_otp_numeric' }),
});

export type TwoFactorOtpFormData = z.infer<typeof twoFactorOtpSchema>;

export const twoFactorBackupSchema = z.object({
  backupCode: z
    .string()
    .trim()
    .min(6, { message: 'validation_backup_code_invalid' }),
});

export type TwoFactorBackupFormData = z.infer<typeof twoFactorBackupSchema>;

export const disable2FASchema = z.object({
  password: z.string().min(1, { message: 'validation_password_required' }),
  currentOtp: z.string().length(6, { message: 'validation_otp_length' }),
});

export type Disable2FAFormData = z.infer<typeof disable2FASchema>;

export const deleteAccountSchema = (targetConfirmation: string, requiresOtp = false) =>
  z
    .object({
      confirmation: z.string(),
      password: z.string().min(1, { message: 'validation_password_required' }),
      otpCode: z.string().optional(),
    })
    .superRefine((data, ctx) => {
      const isMatch =
        data.confirmation.trim().toUpperCase() === 'DELETE' ||
        data.confirmation.trim().toLowerCase() === targetConfirmation.toLowerCase();
      if (!isMatch) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'validation_delete_confirmation_mismatch',
          path: ['confirmation'],
        });
      }
      if (requiresOtp && (!data.otpCode || data.otpCode.length !== 6)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'validation_otp_length',
          path: ['otpCode'],
        });
      }
    });

export type DeleteAccountFormData = {
  confirmation: string;
  password: string;
  otpCode?: string;
};
