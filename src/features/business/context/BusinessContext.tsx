/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { Business } from '../../../lib/types.ts';
import { businessService } from '../services/businessService.ts';
import { useToast } from '../../../components/ui/Toast.tsx';
import { useI18n } from '../../../locales/I18nContext.tsx';

interface BusinessContextType {
  businesses: Business[];
  activeBusiness: Business | null;
  activeBusinessId: string;
  isSwitching: boolean;
  isLoading: boolean;
  switchBusiness: (businessId: string) => Promise<void>;
  createBusiness: (data: Omit<Business, 'id' | 'createdAt' | 'status' | 'role'>) => Promise<Business>;
  reloadBusinesses: () => Promise<void>;
}

const BusinessContext = createContext<BusinessContextType | null>(null);

export const BusinessProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [activeBusinessId, setActiveBusinessIdState] = useState<string>(() => {
    return businessService.getActiveBusinessId();
  });
  const [isSwitching, setIsSwitching] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { success } = useToast();
  const { t } = useI18n();

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const list = await businessService.getBusinesses();
      setBusinesses(list);
      const activeId = businessService.getActiveBusinessId() || list[0]?.id || '';
      setActiveBusinessIdState(activeId);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const switchBusiness = useCallback(
    async (businessId: string) => {
      const target = businesses.find((b) => b.id === businessId);
      if (!target) return;

      setIsSwitching(true);
      // Simulate brief skeleton transition for realistic SaaS feedback
      await new Promise((resolve) => setTimeout(resolve, 350));
      businessService.setActiveBusinessId(businessId);
      setActiveBusinessIdState(businessId);
      setIsSwitching(false);
      success(t('toast_business_switched', { name: target.name }));
    },
    [businesses, success, t]
  );

  const createBusiness = useCallback(
    async (data: Omit<Business, 'id' | 'createdAt' | 'status' | 'role'>) => {
      const created = await businessService.createBusiness(data);
      setBusinesses((prev) => [created, ...prev]);
      setActiveBusinessIdState(created.id);
      success(t('toast_business_created'));
      return created;
    },
    [success, t]
  );

  const activeBusiness = useMemo(() => {
    return businesses.find((b) => b.id === activeBusinessId) || businesses[0] || null;
  }, [businesses, activeBusinessId]);

  const value = useMemo(
    () => ({
      businesses,
      activeBusiness,
      activeBusinessId,
      isSwitching,
      isLoading,
      switchBusiness,
      createBusiness,
      reloadBusinesses: load,
    }),
    [
      businesses,
      activeBusiness,
      activeBusinessId,
      isSwitching,
      isLoading,
      switchBusiness,
      createBusiness,
      load,
    ]
  );

  return <BusinessContext.Provider value={value}>{children}</BusinessContext.Provider>;
};

export function useBusiness(): BusinessContextType {
  const context = useContext(BusinessContext);
  if (!context) {
    throw new Error('useBusiness must be used within a BusinessProvider');
  }
  return context;
}
