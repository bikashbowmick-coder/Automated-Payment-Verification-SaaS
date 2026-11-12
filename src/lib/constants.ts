/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const OTP_LENGTH = 6;
export const RESEND_COOLDOWN_SECONDS = 60;
export const MAX_AVATAR_BYTES = 2 * 1024 * 1024; // 2MB
export const PAGE_SIZE = 20;
export const MAX_LOGIN_ATTEMPTS = 5;
export const LOGIN_COOLDOWN_SECONDS = 60;
export const ACCOUNT_DELETION_GRACE_DAYS = 14;

export const BANGLADESH_PHONE_REGEX = /^(?:\+?880|0)?1[3-9]\d{8}$/;

export const BUSINESS_CATEGORIES = [
  'E-commerce & Retail',
  'Fashion & Apparel',
  'Electronics & Gadgets',
  'Groceries & Daily Needs',
  'Services & Freelancing',
  'Education & Training',
  'Health & Personal Care',
  'Food & Restaurant',
  'Wholesale & Distribution',
  'Other'
] as const;
