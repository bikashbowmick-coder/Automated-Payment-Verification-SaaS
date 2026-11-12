/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { UserProfile, Business, UserSession, LoginEvent } from './types.ts';

/**
 * Interface representing the typed Supabase Auth and Database Adapter contract.
 * In a live Supabase production deployment, this adapter connects directly to
 * @supabase/supabase-js client methods (e.g. supabase.auth.signUp, signInWithPassword,
 * mfa.enroll, etc.).
 */
export interface SupabaseAuthAdapter {
  signUp(email: string, password: string, fullName: string): Promise<{ user: UserProfile | null; error: Error | null }>;
  signInWithPassword(email: string, password: string): Promise<{ session: { user: UserProfile; token: string } | null; error: Error | null }>;
  signInWithOAuth(provider: 'google'): Promise<{ url: string | null; error: Error | null }>;
  resetPasswordForEmail(email: string): Promise<{ error: Error | null }>;
  updateUserPassword(newPassword: string): Promise<{ error: Error | null }>;
  verifyEmailOtp(email: string, token: string): Promise<{ success: boolean; error: Error | null }>;
  resendVerificationEmail(email: string): Promise<{ success: boolean; error: Error | null }>;
  enrollMfa(): Promise<{ qrCode: string; secret: string; backupCodes: string[]; error: Error | null }>;
  challengeAndVerifyMfa(factorId: string, code: string): Promise<{ verified: boolean; error: Error | null }>;
  unenrollMfa(factorId: string): Promise<{ success: boolean; error: Error | null }>;
  signOut(scope?: 'global' | 'local' | 'others'): Promise<{ error: Error | null }>;
}

export interface SupabaseDbAdapter {
  getProfile(userId: string): Promise<UserProfile>;
  updateProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile>;
  getBusinesses(userId: string): Promise<Business[]>;
  createBusiness(business: Omit<Business, 'id'>): Promise<Business>;
  getSessions(userId: string): Promise<UserSession[]>;
  revokeSession(sessionId: string): Promise<boolean>;
  revokeOtherSessions(currentSessionId: string): Promise<boolean>;
  getLoginHistory(userId: string, page: number, pageSize: number): Promise<{ items: LoginEvent[]; total: number }>;
}
