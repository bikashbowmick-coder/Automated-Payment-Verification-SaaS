/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './app/ThemeContext.tsx';
import { I18nProvider } from './locales/I18nContext.tsx';
import { ToastProvider } from './components/ui/Toast.tsx';
import { AuthProvider } from './features/auth/context/AuthContext.tsx';
import { BusinessProvider } from './features/business/context/BusinessContext.tsx';
import { router } from './app/router.tsx';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 60 seconds
      retry: 1,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <I18nProvider>
          <ToastProvider>
            <AuthProvider>
              <BusinessProvider>
                <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B1220] text-[#0F172A] dark:text-[#E5EDF9] font-sans antialiased">
                  <RouterProvider router={router} />
                </div>
              </BusinessProvider>
            </AuthProvider>
          </ToastProvider>
        </I18nProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
