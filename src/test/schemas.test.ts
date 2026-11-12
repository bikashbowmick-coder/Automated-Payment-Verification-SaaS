/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, it, expect } from 'vitest';
import {
  registerSchema,
  loginSchema,
  profileSchema,
  businessSchema,
  changePasswordSchema,
} from '../lib/schemas.ts';

describe('Zod Validation Schemas', () => {
  describe('registerSchema', () => {
    it('accepts valid registration data', () => {
      const valid = {
        fullName: 'Tanvir Ahmed',
        email: 'merchant@mysas.com.bd',
        password: 'Password123!',
        confirmPassword: 'Password123!',
        termsAccepted: true,
      };
      expect(() => registerSchema.parse(valid)).not.toThrow();
    });

    it('rejects mismatched passwords', () => {
      const invalid = {
        fullName: 'Tanvir Ahmed',
        email: 'merchant@mysas.com.bd',
        password: 'Password123!',
        confirmPassword: 'DifferentPassword!',
        termsAccepted: true,
      };
      expect(() => registerSchema.parse(invalid)).toThrow();
    });

    it('requires terms to be accepted', () => {
      const invalid = {
        fullName: 'Tanvir Ahmed',
        email: 'merchant@mysas.com.bd',
        password: 'Password123!',
        confirmPassword: 'Password123!',
        termsAccepted: false,
      };
      expect(() => registerSchema.parse(invalid)).toThrow();
    });
  });

  describe('loginSchema', () => {
    it('accepts valid email and non-empty password', () => {
      const valid = {
        email: 'test@example.com',
        password: 'secretPassword',
        rememberDevice: true,
      };
      expect(() => loginSchema.parse(valid)).not.toThrow();
    });

    it('rejects invalid email format', () => {
      const invalid = {
        email: 'invalid-email',
        password: 'password',
      };
      expect(() => loginSchema.parse(invalid)).toThrow();
    });
  });

  describe('profileSchema & Bangladesh phone validation', () => {
    it('accepts valid Bangladesh phone numbers', () => {
      expect(() =>
        profileSchema.parse({
          fullName: 'Tanvir',
          phone: '01711223344',
          language: 'en',
        })
      ).not.toThrow();

      expect(() =>
        profileSchema.parse({
          fullName: 'Tanvir',
          phone: '+8801822334455',
          language: 'bn',
        })
      ).not.toThrow();
    });

    it('rejects invalid phone numbers', () => {
      expect(() =>
        profileSchema.parse({
          fullName: 'Tanvir',
          phone: '1234567',
          language: 'en',
        })
      ).toThrow();
    });
  });

  describe('businessSchema', () => {
    it('requires name and category', () => {
      const valid = {
        name: 'Dhaka Artisan',
        category: 'Fashion & Apparel',
        phone: '01711223344',
      };
      expect(() => businessSchema.parse(valid)).not.toThrow();

      const invalid = {
        name: '',
        category: '',
      };
      expect(() => businessSchema.parse(invalid)).toThrow();
    });
  });

  describe('changePasswordSchema', () => {
    it('rejects new password if identical to current password', () => {
      const invalid = {
        currentPassword: 'SamePassword123!',
        newPassword: 'SamePassword123!',
        confirmNewPassword: 'SamePassword123!',
      };
      expect(() => changePasswordSchema.parse(invalid)).toThrow();
    });
  });
});
