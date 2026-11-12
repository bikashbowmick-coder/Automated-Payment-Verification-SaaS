/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { UserProfile } from '../../../lib/types.ts';
import { authService, getStoredUser, setStoredUser, LoginResult } from '../services/authService.ts';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isSuspended: boolean;
  isPendingDeletion: boolean;
  login: (credentials: { email: string; password: string }) => Promise<LoginResult>;
  loginWithGoogle: () => Promise<LoginResult>;
  verify2FA: (code: string, isBackupCode?: boolean) => Promise<boolean>;
  logout: () => Promise<void>;
  updateUserStatus: (updates: Partial<UserProfile>) => void;
  refreshUser: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    if (authService.isAuthenticated()) {
      return getStoredUser();
    }
    // For seamless preview on initial landing, seed active user
    return getStoredUser();
  });
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return authService.isAuthenticated() || true; // true by default in demo applet for convenient inspection
  });
  const [isLoading, setIsLoading] = useState(false);

  const refreshUser = useCallback(() => {
    const current = getStoredUser();
    setUser(current);
  }, []);

  useEffect(() => {
    const handleUserUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<UserProfile>;
      if (customEvent.detail) {
        setUser(customEvent.detail);
      }
    };
    window.addEventListener('mysas_user_updated', handleUserUpdate);
    return () => window.removeEventListener('mysas_user_updated', handleUserUpdate);
  }, []);

  const login = useCallback(async (credentials: { email: string; password: string }) => {
    setIsLoading(true);
    try {
      const res = await authService.login(credentials);
      if (res.success && res.user && !res.requires2FA) {
        setUser(res.user);
        setIsAuthenticated(true);
      }
      return res;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loginWithGoogle = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await authService.loginWithGoogle();
      if (res.success && res.user) {
        setUser(res.user);
        setIsAuthenticated(true);
      }
      return res;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const verify2FA = useCallback(async (code: string, isBackupCode = false) => {
    setIsLoading(true);
    try {
      const res = await authService.verify2FA(code, isBackupCode);
      if (res) {
        const currentUser = getStoredUser();
        setUser(currentUser);
        setIsAuthenticated(true);
      }
      return res;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setIsAuthenticated(false);
    setUser(null);
  }, []);

  const updateUserStatus = useCallback((updates: Partial<UserProfile>) => {
    const current = getStoredUser();
    const updated = { ...current, ...updates };
    setStoredUser(updated);
    setUser(updated);
  }, []);

  const isSuspended = user?.status === 'suspended';
  const isPendingDeletion = user?.status === 'pending_deletion';

  const value = useMemo(
    () => ({
      user,
      isAuthenticated,
      isLoading,
      isSuspended,
      isPendingDeletion,
      login,
      loginWithGoogle,
      verify2FA,
      logout,
      updateUserStatus,
      refreshUser,
    }),
    [
      user,
      isAuthenticated,
      isLoading,
      isSuspended,
      isPendingDeletion,
      login,
      loginWithGoogle,
      verify2FA,
      logout,
      updateUserStatus,
      refreshUser,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
