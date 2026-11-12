/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import { AuthLayout } from '../layouts/AuthLayout.tsx';
import { OnboardingLayout } from '../layouts/OnboardingLayout.tsx';
import { AccountLayout } from '../layouts/AccountLayout.tsx';
import { ProtectedRoute, PublicOnlyRoute } from './RouteGuards.tsx';
import { Spinner } from '../components/ui/Spinner.tsx';
import { DevSimulationBar } from '../components/DevSimulationBar.tsx';

// Root layout that provides DevSimulationBar within Router context
const RootLayout: React.FC = () => {
  return (
    <>
      <Outlet />
      <DevSimulationBar />
    </>
  );
};

// Lazy-loaded pages for optimal performance and route-level code splitting
const LoginPage = lazy(() =>
  import('../features/auth/pages/LoginPage.tsx').then((m) => ({ default: m.LoginPage }))
);
const RegisterPage = lazy(() =>
  import('../features/auth/pages/RegisterPage.tsx').then((m) => ({ default: m.RegisterPage }))
);
const VerifyEmailPage = lazy(() =>
  import('../features/auth/pages/VerifyEmailPage.tsx').then((m) => ({ default: m.VerifyEmailPage }))
);
const ForgotPasswordPage = lazy(() =>
  import('../features/auth/pages/ForgotPasswordPage.tsx').then((m) => ({
    default: m.ForgotPasswordPage,
  }))
);
const ResetPasswordPage = lazy(() =>
  import('../features/auth/pages/ResetPasswordPage.tsx').then((m) => ({
    default: m.ResetPasswordPage,
  }))
);
const TwoFactorChallengePage = lazy(() =>
  import('../features/auth/pages/TwoFactorChallengePage.tsx').then((m) => ({
    default: m.TwoFactorChallengePage,
  }))
);
const SuspendedAccountPage = lazy(() =>
  import('../features/auth/pages/SuspendedAccountPage.tsx').then((m) => ({
    default: m.SuspendedAccountPage,
  }))
);

const CreateBusinessPage = lazy(() =>
  import('../features/business/pages/CreateBusinessPage.tsx').then((m) => ({
    default: m.CreateBusinessPage,
  }))
);

const ProfilePage = lazy(() =>
  import('../features/profile/pages/ProfilePage.tsx').then((m) => ({ default: m.ProfilePage }))
);
const BusinessesPage = lazy(() =>
  import('../features/business/pages/BusinessesPage.tsx').then((m) => ({
    default: m.BusinessesPage,
  }))
);
const SecurityPage = lazy(() =>
  import('../features/security/pages/SecurityPage.tsx').then((m) => ({ default: m.SecurityPage }))
);
const SessionsPage = lazy(() =>
  import('../features/sessions/pages/SessionsPage.tsx').then((m) => ({ default: m.SessionsPage }))
);
const LoginHistoryPage = lazy(() =>
  import('../features/sessions/pages/LoginHistoryPage.tsx').then((m) => ({
    default: m.LoginHistoryPage,
  }))
);
const DeleteAccountPage = lazy(() =>
  import('../features/account-deletion/pages/DeleteAccountPage.tsx').then((m) => ({
    default: m.DeleteAccountPage,
  }))
);

const PageLoader: React.FC = () => (
  <div className="w-full min-h-[300px] flex items-center justify-center p-8">
    <Spinner size="lg" label="Loading page..." />
  </div>
);

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      // Public Auth Routes
      {
        element: <AuthLayout />,
        children: [
      {
        path: '/login',
        element: (
          <PublicOnlyRoute>
            <Suspense fallback={<PageLoader />}>
              <LoginPage />
            </Suspense>
          </PublicOnlyRoute>
        ),
      },
      {
        path: '/register',
        element: (
          <PublicOnlyRoute>
            <Suspense fallback={<PageLoader />}>
              <RegisterPage />
            </Suspense>
          </PublicOnlyRoute>
        ),
      },
      {
        path: '/verify-email',
        element: (
          <Suspense fallback={<PageLoader />}>
            <VerifyEmailPage />
          </Suspense>
        ),
      },
      {
        path: '/forgot-password',
        element: (
          <PublicOnlyRoute>
            <Suspense fallback={<PageLoader />}>
              <ForgotPasswordPage />
            </Suspense>
          </PublicOnlyRoute>
        ),
      },
      {
        path: '/reset-password',
        element: (
          <Suspense fallback={<PageLoader />}>
            <ResetPasswordPage />
          </Suspense>
        ),
      },
      {
        path: '/2fa-challenge',
        element: (
          <Suspense fallback={<PageLoader />}>
            <TwoFactorChallengePage />
          </Suspense>
        ),
      },
      {
        path: '/suspended',
        element: (
          <Suspense fallback={<PageLoader />}>
            <SuspendedAccountPage />
          </Suspense>
        ),
      },
    ],
  },

  // Onboarding Routes
  {
    element: (
      <ProtectedRoute>
        <OnboardingLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: '/onboarding/create-business',
        element: (
          <Suspense fallback={<PageLoader />}>
            <CreateBusinessPage />
          </Suspense>
        ),
      },
    ],
  },

  // Protected Account Settings Routes
  {
    path: '/settings',
    element: (
      <ProtectedRoute>
        <AccountLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/settings/profile" replace />,
      },
      {
        path: 'profile',
        element: (
          <Suspense fallback={<PageLoader />}>
            <ProfilePage />
          </Suspense>
        ),
      },
      {
        path: 'businesses',
        element: (
          <Suspense fallback={<PageLoader />}>
            <BusinessesPage />
          </Suspense>
        ),
      },
      {
        path: 'security',
        element: (
          <Suspense fallback={<PageLoader />}>
            <SecurityPage />
          </Suspense>
        ),
      },
      {
        path: 'sessions',
        element: (
          <Suspense fallback={<PageLoader />}>
            <SessionsPage />
          </Suspense>
        ),
      },
      {
        path: 'history',
        element: (
          <Suspense fallback={<PageLoader />}>
            <LoginHistoryPage />
          </Suspense>
        ),
      },
      {
        path: 'delete-account',
        element: (
          <Suspense fallback={<PageLoader />}>
            <DeleteAccountPage />
          </Suspense>
        ),
      },
    ],
  },

  // Root redirect
      {
        path: '/',
        element: <Navigate to="/settings/profile" replace />,
      },

      // Catch-all fallback
      {
        path: '*',
        element: <Navigate to="/settings/profile" replace />,
      },
    ],
  },
]);
