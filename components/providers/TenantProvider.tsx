'use client';

/**
 * Tenant Provider Component
 * 
 * This client component provides tenant context to all child components
 * and handles tenant loading states
 */

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { TenantConfig, TenantContext } from '@/types/tenant.types';

const TenantContextObj = createContext<TenantContext>({
  tenant: null,
  loading: true,
  error: null,
});

export function useTenant() {
  return useContext(TenantContextObj);
}

interface TenantProviderProps {
  initialTenant: TenantConfig | null;
  children: ReactNode;
}

export function TenantProvider({ initialTenant, children }: TenantProviderProps) {
  const [tenant, setTenant] = useState<TenantConfig | null>(initialTenant);
  const [loading, setLoading] = useState(!initialTenant);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialTenant) {
      setTenant(initialTenant);
      setLoading(false);
    } else {
      setError('Tenant not found');
      setLoading(false);
    }
  }, [initialTenant]);

  return (
    <TenantContextObj.Provider value={{ tenant, loading, error }}>
      {children}
    </TenantContextObj.Provider>
  );
}

