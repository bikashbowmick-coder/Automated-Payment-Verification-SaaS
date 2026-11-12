/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, it, expect } from 'vitest';
import { calculatePasswordStrength } from '../lib/passwordStrength.ts';

describe('calculatePasswordStrength', () => {
  it('returns score 0 and Very Weak for empty string', () => {
    const result = calculatePasswordStrength('');
    expect(result.score).toBe(0);
    expect(result.label).toBe('Very Weak');
    expect(result.hasMinLength).toBe(false);
  });

  it('detects common passwords and marks them Weak', () => {
    const result = calculatePasswordStrength('password123');
    expect(result.isCommon).toBe(true);
    expect(result.score).toBe(1);
    expect(result.label).toBe('Weak');
  });

  it('requires at least 8 characters to score above 1', () => {
    const result = calculatePasswordStrength('Ab1!');
    expect(result.score).toBeLessThanOrEqual(1);
    expect(result.hasMinLength).toBe(false);
  });

  it('rates balanced password as Strong or Very Strong', () => {
    const result = calculatePasswordStrength('BkDhak@_2026!Sec');
    expect(result.score).toBeGreaterThanOrEqual(3);
    expect(result.hasMinLength).toBe(true);
    expect(result.hasLowercase).toBe(true);
    expect(result.hasUppercase).toBe(true);
    expect(result.hasNumber).toBe(true);
    expect(result.hasSpecialChar).toBe(true);
  });
});
