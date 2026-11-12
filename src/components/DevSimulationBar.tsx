/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Sliders, CheckCircle2, Shield, AlertOctagon, UserX, X, ChevronUp, ChevronDown } from 'lucide-react';
import { useAuth } from '../features/auth/context/AuthContext.tsx';
import { getSimulationSettings, updateSimulationSettings } from '../lib/devSimulator.ts';

export const DevSimulationBar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState(getSimulationSettings());
  const { user, updateUserStatus } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleUpdate = (partial: Parameters<typeof updateSimulationSettings>[0]) => {
    const updated = updateSimulationSettings(partial);
    setSettings(updated);
  };

  const setStatus = (status: 'active' | 'suspended' | 'pending_deletion') => {
    handleUpdate({ userStatusOverride: status });
    updateUserStatus({
      status,
      deletionScheduledAt: status === 'pending_deletion' ? new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString() : undefined,
    });
    if (status === 'suspended') {
      navigate('/suspended');
    }
  };

  const toggleEmailVerified = () => {
    const nextVal = !user?.emailVerified;
    handleUpdate({ emailVerifiedOverride: nextVal });
    updateUserStatus({ emailVerified: nextVal });
    if (!nextVal) {
      navigate('/verify-email');
    }
  };

  const toggle2FA = () => {
    const nextVal = !user?.twoFactorEnabled;
    handleUpdate({ twoFactorOverride: nextVal });
    updateUserStatus({ twoFactorEnabled: nextVal });
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900 text-slate-200 border-t border-slate-700 shadow-2xl text-xs font-sans">
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-teal-400" aria-hidden="true" />
          <span className="font-semibold text-white">Dev State Simulator:</span>
          <span className="text-slate-400 hidden sm:inline">
            Status: <strong className="text-teal-300">{user?.status || 'active'}</strong>
            {' · '}
            2FA: <strong className="text-teal-300">{user?.twoFactorEnabled ? 'On' : 'Off'}</strong>
            {' · '}
            Email: <strong className="text-teal-300">{user?.emailVerified ? 'Verified' : 'Unverified'}</strong>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-white transition-colors"
          >
            <span>{isOpen ? 'Collapse Panel' : 'Simulation Controls & Screen Switcher'}</span>
            {isOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="max-w-7xl mx-auto px-4 py-3 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-in slide-in-from-bottom-2">
          {/* Status overrides */}
          <div>
            <h4 className="font-semibold text-slate-300 mb-2">Simulate Account State</h4>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => setStatus('active')}
                className={`px-2 py-1 rounded text-[11px] font-medium ${
                  user?.status === 'active'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                }`}
              >
                Active
              </button>
              <button
                type="button"
                onClick={() => setStatus('suspended')}
                className={`px-2 py-1 rounded text-[11px] font-medium ${
                  user?.status === 'suspended'
                    ? 'bg-rose-600 text-white'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                }`}
              >
                Suspended
              </button>
              <button
                type="button"
                onClick={() => setStatus('pending_deletion')}
                className={`px-2 py-1 rounded text-[11px] font-medium ${
                  user?.status === 'pending_deletion'
                    ? 'bg-amber-600 text-white'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                }`}
              >
                Pending Deletion
              </button>
            </div>
          </div>

          {/* Security toggles */}
          <div>
            <h4 className="font-semibold text-slate-300 mb-2">Flags & Security</h4>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={toggle2FA}
                className={`px-2 py-1 rounded text-[11px] font-medium ${
                  user?.twoFactorEnabled ? 'bg-teal-700 text-white' : 'bg-slate-800 text-slate-300'
                }`}
              >
                2FA: {user?.twoFactorEnabled ? 'Enabled' : 'Disabled'}
              </button>
              <button
                type="button"
                onClick={toggleEmailVerified}
                className={`px-2 py-1 rounded text-[11px] font-medium ${
                  user?.emailVerified ? 'bg-teal-700 text-white' : 'bg-slate-800 text-slate-300'
                }`}
              >
                Email: {user?.emailVerified ? 'Verified' : 'Unverified'}
              </button>
              <button
                type="button"
                onClick={() => handleUpdate({ shouldFail: !settings.shouldFail })}
                className={`px-2 py-1 rounded text-[11px] font-medium ${
                  settings.shouldFail ? 'bg-rose-700 text-white' : 'bg-slate-800 text-slate-300'
                }`}
              >
                Simulate Network Error: {settings.shouldFail ? 'ON' : 'OFF'}
              </button>
            </div>
          </div>

          {/* Quick jump to any of the 13 screens */}
          <div className="sm:col-span-2">
            <h4 className="font-semibold text-slate-300 mb-2">Direct Screen Switcher (All 13 Screens)</h4>
            <div className="flex flex-wrap gap-1">
              {[
                { path: '/register', label: '1. Register' },
                { path: '/verify-email', label: '2. Verify Email' },
                { path: '/login', label: '3. Login' },
                { path: '/forgot-password', label: '4. Forgot Pass' },
                { path: '/reset-password?token=valid_token', label: '5. Reset Pass' },
                { path: '/2fa-challenge', label: '6. 2FA Challenge' },
                { path: '/onboarding/create-business', label: '7. Onboard Biz' },
                { path: '/settings/profile', label: '8. Profile' },
                { path: '/settings/businesses', label: '9. Businesses' },
                { path: '/settings/security', label: '10. Security' },
                { path: '/settings/sessions', label: '11. Sessions' },
                { path: '/settings/history', label: '12. History' },
                { path: '/suspended', label: '13. Suspended' },
                { path: '/settings/delete-account', label: '14. Delete Acct' },
              ].map((screen) => (
                <button
                  key={screen.path}
                  type="button"
                  onClick={() => navigate(screen.path)}
                  className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors ${
                    location.pathname === screen.path.split('?')[0]
                      ? 'bg-teal-600 text-white font-bold'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                  }`}
                >
                  {screen.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
