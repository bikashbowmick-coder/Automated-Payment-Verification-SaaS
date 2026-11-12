/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../features/auth/context/AuthContext.tsx';
import { Spinner } from '../components/ui/Spinner.tsx';

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated, isLoading, isSuspended } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] dark:bg-[#0B1220]">
        <Spinner size="lg" label="Authenticating..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (isSuspended && location.pathname !== '/suspended') {
    return <Navigate to="/suspended" replace />;
  }

  if (user && !user.emailVerified && location.pathname !== '/verify-email') {
    return <Navigate to="/verify-email" replace />;
  }

  return <>{children}</>;
};

export const PublicOnlyRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading, isSuspended, user } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] dark:bg-[#0B1220]">
        <Spinner size="lg" label="Loading..." />
      </div>
    );
  }

  if (isAuthenticated) {
    if (isSuspended) {
      return <Navigate to="/suspended" replace />;
    }
    if (user && !user.emailVerified) {
      return <Navigate to="/verify-email" replace />;
    }
    const destination = (location.state as { from?: { pathname: string } })?.from?.pathname || '/settings/profile';
    return <Navigate to={destination} replace />;
  }

  return <>{children}</>;
};
