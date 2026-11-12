/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { UserProfile, TwoFactorSetupData } from '../../../lib/types.ts';
import { simulateNetwork, getSimulationSettings } from '../../../lib/devSimulator.ts';
import { INITIAL_USER, MOCK_BACKUP_CODES } from '../../../lib/mockData.ts';
import { MAX_LOGIN_ATTEMPTS, LOGIN_COOLDOWN_SECONDS } from '../../../lib/constants.ts';

const USER_STORAGE_KEY = 'mysas_current_user';
const SESSION_TOKEN_KEY = 'mysas_auth_token';
const FAILED_ATTEMPTS_KEY = 'mysas_failed_attempts';
const LOCKOUT_EXPIRY_KEY = 'mysas_lockout_until';

// Helper to get or seed persisted mock user
export const getStoredUser = (): UserProfile => {
  try {
    const raw = localStorage.getItem(USER_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return INITIAL_USER;
};

export const setStoredUser = (user: UserProfile) => {
  try {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    window.dispatchEvent(new CustomEvent('mysas_user_updated', { detail: user }));
  } catch {
    // ignore
  }
};

export interface LoginResult {
  success: boolean;
  requires2FA?: boolean;
  isSuspended?: boolean;
  unverifiedEmail?: boolean;
  user?: UserProfile;
  error?: string;
  cooldownRemaining?: number;
}

export const authService = {
  getLockoutStatus(): { isLocked: boolean; secondsRemaining: number } {
    try {
      const lockoutUntil = parseInt(localStorage.getItem(LOCKOUT_EXPIRY_KEY) || '0', 10);
      const now = Date.now();
      if (lockoutUntil > now) {
        return {
          isLocked: true,
          secondsRemaining: Math.ceil((lockoutUntil - now) / 1000),
        };
      }
    } catch {
      // ignore
    }
    return { isLocked: false, secondsRemaining: 0 };
  },

  recordFailedAttempt(): { isLocked: boolean; secondsRemaining: number } {
    try {
      const attempts = parseInt(localStorage.getItem(FAILED_ATTEMPTS_KEY) || '0', 10) + 1;
      localStorage.setItem(FAILED_ATTEMPTS_KEY, attempts.toString());

      if (attempts >= MAX_LOGIN_ATTEMPTS) {
        const lockoutUntil = Date.now() + LOGIN_COOLDOWN_SECONDS * 1000;
        localStorage.setItem(LOCKOUT_EXPIRY_KEY, lockoutUntil.toString());
        return { isLocked: true, secondsRemaining: LOGIN_COOLDOWN_SECONDS };
      }
    } catch {
      // ignore
    }
    return { isLocked: false, secondsRemaining: 0 };
  },

  clearFailedAttempts() {
    try {
      localStorage.removeItem(FAILED_ATTEMPTS_KEY);
      localStorage.removeItem(LOCKOUT_EXPIRY_KEY);
    } catch {
      // ignore
    }
  },

  async register(data: { fullName: string; email: string; password: string }): Promise<UserProfile> {
    return simulateNetwork(() => {
      const existing = getStoredUser();
      if (existing.email.toLowerCase() === data.email.toLowerCase()) {
        throw new Error('DUPLICATE_EMAIL');
      }

      const newUser: UserProfile = {
        id: `usr_${Date.now().toString(36)}`,
        fullName: data.fullName,
        email: data.email,
        language: 'en',
        emailVerified: false,
        twoFactorEnabled: false,
        status: 'active',
      };

      setStoredUser(newUser);
      return newUser;
    });
  },

  async login(credentials: { email: string; password: string }): Promise<LoginResult> {
    return simulateNetwork(() => {
      // Check lockout first
      const lockout = this.getLockoutStatus();
      if (lockout.isLocked) {
        return {
          success: false,
          error: 'LOCKED_OUT',
          cooldownRemaining: lockout.secondsRemaining,
        };
      }

      const sim = getSimulationSettings();
      let user = getStoredUser();

      // Apply any simulation overrides
      if (sim.userStatusOverride) {
        user = { ...user, status: sim.userStatusOverride };
      }
      if (sim.emailVerifiedOverride !== undefined) {
        user = { ...user, emailVerified: sim.emailVerifiedOverride };
      }
      if (sim.twoFactorOverride !== undefined) {
        user = { ...user, twoFactorEnabled: sim.twoFactorOverride };
      }

      // Check credentials (accepting user's stored password or standard demo password)
      const isMatch =
        (credentials.email.toLowerCase() === user.email.toLowerCase() ||
          credentials.email.toLowerCase() === 'merchant@mysas.com.bd') &&
        credentials.password.length >= 6;

      if (!isMatch) {
        const result = this.recordFailedAttempt();
        return {
          success: false,
          error: 'INVALID_CREDENTIALS',
          cooldownRemaining: result.secondsRemaining,
        };
      }

      this.clearFailedAttempts();

      if (user.status === 'suspended') {
        return { success: false, isSuspended: true, user };
      }

      if (!user.emailVerified) {
        return { success: false, unverifiedEmail: true, user };
      }

      if (user.twoFactorEnabled) {
        // Return MFA challenge needed
        return { success: true, requires2FA: true, user };
      }

      // Successful direct login
      localStorage.setItem(SESSION_TOKEN_KEY, `jwt_demo_${Date.now()}`);
      return { success: true, user };
    });
  },

  async loginWithGoogle(): Promise<LoginResult> {
    return simulateNetwork(() => {
      this.clearFailedAttempts();
      const user = getStoredUser();
      localStorage.setItem(SESSION_TOKEN_KEY, `jwt_google_${Date.now()}`);
      return { success: true, user };
    });
  },

  async verify2FA(code: string, isBackupCode = false): Promise<boolean> {
    return simulateNetwork(() => {
      if (isBackupCode) {
        const isValid = MOCK_BACKUP_CODES.includes(code.trim().toUpperCase());
        if (!isValid) throw new Error('INVALID_BACKUP_CODE');
      } else {
        // Any 6-digit number except '000000' is accepted in demo mode
        if (code === '000000' || code.length !== 6) {
          throw new Error('INVALID_OTP');
        }
      }
      localStorage.setItem(SESSION_TOKEN_KEY, `jwt_mfa_${Date.now()}`);
      return true;
    });
  },

  async verifyEmail(_email: string, _token?: string): Promise<boolean> {
    return simulateNetwork(() => {
      const user = getStoredUser();
      const updated: UserProfile = { ...user, emailVerified: true };
      setStoredUser(updated);
      return true;
    });
  },

  async resendVerificationEmail(_email: string): Promise<boolean> {
    return simulateNetwork(() => {
      return true;
    });
  },

  async requestPasswordReset(_email: string): Promise<boolean> {
    return simulateNetwork(() => {
      // Neutral response to prevent enumeration
      return true;
    });
  },

  async resetPassword(_token: string, _newPassword: string): Promise<boolean> {
    return simulateNetwork(() => {
      if (_token === 'expired') {
        throw new Error('TOKEN_EXPIRED');
      }
      return true;
    });
  },

  async setup2FA(): Promise<TwoFactorSetupData> {
    return simulateNetwork(() => {
      return {
        manualKey: 'JBSWY3DPEHPK3PXP',
        qrCodeUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="200" height="200" fill="%23ffffff"/><rect x="20" y="20" width="50" height="50" fill="%2314595a"/><rect x="130" y="20" width="50" height="50" fill="%2314595a"/><rect x="20" y="130" width="50" height="50" fill="%2314595a"/><rect x="35" y="35" width="20" height="20" fill="%23ffffff"/><rect x="145" y="35" width="20" height="20" fill="%23ffffff"/><rect x="35" y="145" width="20" height="20" fill="%23ffffff"/><rect x="80" y="30" width="15" height="15" fill="%2314595a"/><rect x="100" y="45" width="15" height="15" fill="%2314595a"/><rect x="80" y="70" width="40" height="15" fill="%2314595a"/><rect x="30" y="90" width="15" height="25" fill="%2314595a"/><rect x="140" y="90" width="25" height="15" fill="%2314595a"/><rect x="90" y="105" width="20" height="20" fill="%2314595a"/><rect x="80" y="140" width="30" height="20" fill="%2314595a"/><rect x="130" y="130" width="50" height="50" fill="%2314595a"/><rect x="145" y="145" width="20" height="20" fill="%23ffffff"/></svg>',
        backupCodes: MOCK_BACKUP_CODES,
      };
    });
  },

  async confirm2FASetup(code: string): Promise<boolean> {
    return simulateNetwork(() => {
      if (code === '000000' || code.length !== 6) {
        throw new Error('INVALID_OTP');
      }
      const user = getStoredUser();
      const updated: UserProfile = { ...user, twoFactorEnabled: true };
      setStoredUser(updated);
      return true;
    });
  },

  async disable2FA(password: string, code: string): Promise<boolean> {
    return simulateNetwork(() => {
      if (!password || password.length < 6) {
        throw new Error('INVALID_PASSWORD');
      }
      if (code === '000000' || code.length !== 6) {
        throw new Error('INVALID_OTP');
      }
      const user = getStoredUser();
      const updated: UserProfile = { ...user, twoFactorEnabled: false };
      setStoredUser(updated);
      return true;
    });
  },

  async logout(): Promise<void> {
    try {
      localStorage.removeItem(SESSION_TOKEN_KEY);
    } catch {
      // ignore
    }
  },

  isAuthenticated(): boolean {
    try {
      return Boolean(localStorage.getItem(SESSION_TOKEN_KEY));
    } catch {
      return false;
    }
  },
};
