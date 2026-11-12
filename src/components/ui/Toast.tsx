/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastItem {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
}

interface ToastContextType {
  addToast: (toast: Omit<ToastItem, 'id'>) => void;
  removeToast: (id: string) => void;
  success: (message: string, title?: string) => void;
  error: (message: string, title?: string) => void;
  warning: (message: string, title?: string) => void;
  info: (message: string, title?: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((toast: Omit<ToastItem, 'id'>) => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const newToast: ToastItem = { ...toast, id };
    setToasts((prev) => [...prev, newToast]);
  }, []);

  const success = useCallback((message: string, title?: string) => {
    addToast({ type: 'success', message, title, duration: 5000 });
  }, [addToast]);

  const error = useCallback((message: string, title?: string) => {
    // Errors stay until dismissed (no auto duration or high duration)
    addToast({ type: 'error', message, title, duration: 0 });
  }, [addToast]);

  const warning = useCallback((message: string, title?: string) => {
    addToast({ type: 'warning', message, title, duration: 6000 });
  }, [addToast]);

  const info = useCallback((message: string, title?: string) => {
    addToast({ type: 'info', message, title, duration: 5000 });
  }, [addToast]);

  const value = useMemo(
    () => ({
      addToast,
      removeToast,
      success,
      error,
      warning,
      info,
    }),
    [addToast, removeToast, success, error, warning, info]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <aside
        aria-label="Notifications"
        className="fixed z-50 pointer-events-none flex flex-col gap-2 p-4 top-4 left-4 right-4 sm:top-auto sm:bottom-4 sm:left-auto sm:right-4 sm:w-96 max-w-full"
      >
        {toasts.map((toast) => (
          <ToastCard key={toast.id} toast={toast} onDismiss={() => removeToast(toast.id)} />
        ))}
      </aside>
    </ToastContext.Provider>
  );
};

const ToastCard: React.FC<{ toast: ToastItem; onDismiss: () => void }> = ({ toast, onDismiss }) => {
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!toast.duration || toast.duration <= 0) return;

    if (!isPaused) {
      timerRef.current = setTimeout(() => {
        onDismiss();
      }, toast.duration);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [toast.duration, isPaused, onDismiss]);

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" aria-hidden="true" />,
    error: <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" aria-hidden="true" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" aria-hidden="true" />,
    info: <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" aria-hidden="true" />,
  };

  const borders = {
    success: 'border-emerald-200 dark:border-emerald-800/60 bg-white dark:bg-[#111A2E]',
    error: 'border-rose-200 dark:border-rose-800/60 bg-white dark:bg-[#111A2E]',
    warning: 'border-amber-200 dark:border-amber-800/60 bg-white dark:bg-[#111A2E]',
    info: 'border-blue-200 dark:border-blue-800/60 bg-white dark:bg-[#111A2E]',
  };

  return (
    <div
      role={toast.type === 'error' ? 'alert' : 'status'}
      aria-live={toast.type === 'error' ? 'assertive' : 'polite'}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border shadow-lg transition-all duration-200 animate-in fade-in slide-in-from-top-2 sm:slide-in-from-bottom-2 ${borders[toast.type]}`}
    >
      {icons[toast.type]}
      <div className="flex-1 min-w-0 pt-0.5">
        {toast.title && (
          <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-0.5">
            {toast.title}
          </h4>
        )}
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 break-words leading-relaxed">
          {toast.message}
        </p>
      </div>
      <button
        onClick={onDismiss}
        aria-label="Dismiss notification"
        className="p-1 -mr-1 -mt-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#4F46E5]"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export function useToast(): ToastContextType {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
