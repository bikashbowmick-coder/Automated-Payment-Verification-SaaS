/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  language: 'en' | 'bn';
  emailVerified: boolean;
  twoFactorEnabled: boolean;
  status: 'active' | 'suspended' | 'pending_deletion';
  deletionScheduledAt?: string;
}

export interface Business {
  id: string;
  name: string;
  logoUrl?: string;
  category: string;
  phone?: string;
  status: 'active' | 'pending' | 'suspended';
  role: 'owner' | 'admin' | 'staff';
  createdAt?: string;
}

export interface UserSession {
  id: string;
  deviceLabel: string;
  browser: string;
  os: string;
  ipAddress: string;
  approxLocation?: string;
  lastActiveAt: string;
  createdAt: string;
  isCurrent: boolean;
}

export interface LoginEvent {
  id: string;
  occurredAt: string;
  status: 'success' | 'failed' | 'blocked';
  method: 'password' | 'google' | '2fa';
  ipAddress: string;
  deviceLabel: string;
  approxLocation?: string;
}

export interface SecurityOverview {
  emailVerified: boolean;
  twoFactorEnabled: boolean;
  lastPasswordChangedAt: string;
  activeSessionsCount: number;
  unresolvedSecurityAlerts: number;
}

export interface TwoFactorSetupData {
  manualKey: string;
  qrCodeUrl: string;
  backupCodes: string[];
}

export interface AuthSession {
  user: UserProfile;
  token: string;
  expiresAt: string;
}

export type ThemeMode = 'light' | 'dark';
export type SupportedLanguage = 'en' | 'bn';
