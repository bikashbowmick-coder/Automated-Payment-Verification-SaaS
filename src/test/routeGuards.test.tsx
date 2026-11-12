/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { ProtectedRoute, PublicOnlyRoute } from '../app/RouteGuards.tsx';
import * as AuthContextModule from '../features/auth/context/AuthContext.tsx';
import { UserProfile } from '../lib/types.ts';

describe('Route Guards', () => {
  const mockActiveUser: UserProfile = {
    id: 'u1',
    fullName: 'Test User',
    email: 'test@example.com',
    language: 'en',
    emailVerified: true,
    twoFactorEnabled: false,
    status: 'active',
  };

  it('renders children in ProtectedRoute when authenticated and active', () => {
    vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
      user: mockActiveUser,
      isAuthenticated: true,
      isLoading: false,
      isSuspended: false,
      isPendingDeletion: false,
      login: vi.fn(),
      loginWithGoogle: vi.fn(),
      verify2FA: vi.fn(),
      logout: vi.fn(),
      updateUserStatus: vi.fn(),
      refreshUser: vi.fn(),
    });

    render(
      <MemoryRouter initialEntries={['/settings/profile']}>
        <Routes>
          <Route
            path="/settings/profile"
            element={
              <ProtectedRoute>
                <div>Protected Content Area</div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Protected Content Area')).toBeDefined();
  });

  it('redirects unauthenticated user to login in ProtectedRoute', () => {
    vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      isSuspended: false,
      isPendingDeletion: false,
      login: vi.fn(),
      loginWithGoogle: vi.fn(),
      verify2FA: vi.fn(),
      logout: vi.fn(),
      updateUserStatus: vi.fn(),
      refreshUser: vi.fn(),
    });

    render(
      <MemoryRouter initialEntries={['/settings/profile']}>
        <Routes>
          <Route
            path="/settings/profile"
            element={
              <ProtectedRoute>
                <div>Protected Content</div>
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<div>Login Page Screen</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Login Page Screen')).toBeDefined();
  });

  it('redirects suspended user to /suspended in ProtectedRoute', () => {
    vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
      user: { ...mockActiveUser, status: 'suspended' },
      isAuthenticated: true,
      isLoading: false,
      isSuspended: true,
      isPendingDeletion: false,
      login: vi.fn(),
      loginWithGoogle: vi.fn(),
      verify2FA: vi.fn(),
      logout: vi.fn(),
      updateUserStatus: vi.fn(),
      refreshUser: vi.fn(),
    });

    render(
      <MemoryRouter initialEntries={['/settings/profile']}>
        <Routes>
          <Route
            path="/settings/profile"
            element={
              <ProtectedRoute>
                <div>Protected Content</div>
              </ProtectedRoute>
            }
          />
          <Route path="/suspended" element={<div>Suspended Account Screen</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Suspended Account Screen')).toBeDefined();
  });
});
