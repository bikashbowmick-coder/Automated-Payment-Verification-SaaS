/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Business } from '../../../lib/types.ts';
import { simulateNetwork } from '../../../lib/devSimulator.ts';
import { INITIAL_BUSINESSES } from '../../../lib/mockData.ts';

const BUSINESSES_KEY = 'mysas_businesses';
const ACTIVE_BIZ_KEY = 'mysas_active_biz_id';

const getStoredBusinesses = (): Business[] => {
  try {
    const raw = localStorage.getItem(BUSINESSES_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return INITIAL_BUSINESSES;
};

const setStoredBusinesses = (businesses: Business[]) => {
  try {
    localStorage.setItem(BUSINESSES_KEY, JSON.stringify(businesses));
  } catch {
    // ignore
  }
};

export const businessService = {
  async getBusinesses(): Promise<Business[]> {
    return simulateNetwork(() => {
      return getStoredBusinesses();
    });
  },

  getActiveBusinessId(): string {
    try {
      const saved = localStorage.getItem(ACTIVE_BIZ_KEY);
      if (saved) return saved;
    } catch {
      // ignore
    }
    const list = getStoredBusinesses();
    return list[0]?.id || '';
  },

  setActiveBusinessId(businessId: string): void {
    try {
      localStorage.setItem(ACTIVE_BIZ_KEY, businessId);
      window.dispatchEvent(new CustomEvent('mysas_biz_switched', { detail: businessId }));
    } catch {
      // ignore
    }
  },

  async createBusiness(data: Omit<Business, 'id' | 'createdAt' | 'status' | 'role'>): Promise<Business> {
    return simulateNetwork(() => {
      const list = getStoredBusinesses();
      const newBiz: Business = {
        id: `biz_${Date.now().toString(36)}`,
        name: data.name,
        category: data.category,
        phone: data.phone,
        logoUrl: data.logoUrl,
        status: 'active',
        role: 'owner',
        createdAt: new Date().toISOString(),
      };
      const updated = [newBiz, ...list];
      setStoredBusinesses(updated);
      this.setActiveBusinessId(newBiz.id);
      return newBiz;
    });
  },
};
