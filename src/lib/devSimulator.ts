/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface SimulationSettings {
  latencyMs: number;
  shouldFail: boolean;
  userStatusOverride: 'active' | 'suspended' | 'pending_deletion';
  emailVerifiedOverride: boolean;
  twoFactorOverride: boolean;
  simulateRateLimit: boolean;
}

const STORAGE_KEY = 'mysas_sim_settings';

const defaultSettings: SimulationSettings = {
  latencyMs: 500,
  shouldFail: false,
  userStatusOverride: 'active',
  emailVerifiedOverride: true,
  twoFactorOverride: true,
  simulateRateLimit: false,
};

export const getSimulationSettings = (): SimulationSettings => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...defaultSettings, ...JSON.parse(raw) };
  } catch {
    // ignore
  }
  return defaultSettings;
};

export const updateSimulationSettings = (partial: Partial<SimulationSettings>) => {
  try {
    const current = getSimulationSettings();
    const updated = { ...current, ...partial };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('mysas_sim_change', { detail: updated }));
    return updated;
  } catch {
    return defaultSettings;
  }
};

export const simulateNetwork = async <T>(resolver: () => T | Promise<T>): Promise<T> => {
  const settings = getSimulationSettings();
  if (settings.latencyMs > 0) {
    await new Promise((resolve) => setTimeout(resolve, settings.latencyMs));
  }
  if (settings.shouldFail) {
    throw new Error('SIMULATED_NETWORK_FAILURE');
  }
  return resolver();
};
