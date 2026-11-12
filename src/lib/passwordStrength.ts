/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface PasswordStrengthResult {
  score: number; // 0 to 4
  label: 'Very Weak' | 'Weak' | 'Fair' | 'Strong' | 'Very Strong';
  labelKey: string;
  hasMinLength: boolean;
  hasLowercase: boolean;
  hasUppercase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
  isCommon: boolean;
  feedback: string[];
}

const COMMON_PASSWORDS = new Set([
  'password',
  'password123',
  '12345678',
  '123456789',
  'qwerty123',
  'admin123',
  'bangladesh',
  'mysas123',
  'welcome123',
  'iloveyou123'
]);

/**
 * Calculates the security strength of a given password.
 * Evaluates length, character variety, and common password patterns.
 */
export function calculatePasswordStrength(password: string): PasswordStrengthResult {
  if (!password) {
    return {
      score: 0,
      label: 'Very Weak',
      labelKey: 'strength_very_weak',
      hasMinLength: false,
      hasLowercase: false,
      hasUppercase: false,
      hasNumber: false,
      hasSpecialChar: false,
      isCommon: false,
      feedback: ['enter_password']
    };
  }

  const hasMinLength = password.length >= 8;
  const hasLowercase = /[a-z]/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[^A-Za-z0-9]/.test(password);
  const isCommon = COMMON_PASSWORDS.has(password.toLowerCase().trim());

  const feedback: string[] = [];
  if (!hasMinLength) feedback.push('min_8_chars');
  if (!hasLowercase) feedback.push('include_lowercase');
  if (!hasUppercase) feedback.push('include_uppercase');
  if (!hasNumber) feedback.push('include_number');
  if (!hasSpecialChar) feedback.push('include_special');
  if (isCommon) feedback.push('too_common');

  if (isCommon) {
    return {
      score: 1,
      label: 'Weak',
      labelKey: 'strength_weak',
      hasMinLength,
      hasLowercase,
      hasUppercase,
      hasNumber,
      hasSpecialChar,
      isCommon: true,
      feedback
    };
  }

  let passedCriteria = 0;
  if (hasMinLength) passedCriteria++;
  if (password.length >= 12) passedCriteria++;
  if (hasLowercase && hasUppercase) passedCriteria++;
  if (hasNumber) passedCriteria++;
  if (hasSpecialChar) passedCriteria++;

  let score = 0;
  if (passedCriteria <= 1) score = 1;
  else if (passedCriteria === 2) score = 2;
  else if (passedCriteria === 3 || passedCriteria === 4) score = 3;
  else score = 4;

  if (password.length < 8) {
    score = Math.min(score, 1);
  }

  const labelMap: Record<number, { label: PasswordStrengthResult['label']; key: string }> = {
    0: { label: 'Very Weak', key: 'strength_very_weak' },
    1: { label: 'Weak', key: 'strength_weak' },
    2: { label: 'Fair', key: 'strength_fair' },
    3: { label: 'Strong', key: 'strength_strong' },
    4: { label: 'Very Strong', key: 'strength_very_strong' }
  };

  return {
    score,
    label: labelMap[score].label,
    labelKey: labelMap[score].key,
    hasMinLength,
    hasLowercase,
    hasUppercase,
    hasNumber,
    hasSpecialChar,
    isCommon: false,
    feedback
  };
}
