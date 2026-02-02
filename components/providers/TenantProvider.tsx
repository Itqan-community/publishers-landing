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
  basePath: '',
  loading: true,
  error: null,
});

export function useTenant() {
  return useContext(TenantContextObj);
}

interface TenantProviderProps {
  initialTenant: TenantConfig | null;
  /** Base path for links: '' on custom domain, '/<tenantId>' on path-based */
  initialBasePath?: string;
  children: ReactNode;
}

export function TenantProvider({
  initialTenant,
  initialBasePath = '',
  children,
}: TenantProviderProps) {
  const [tenant, setTenant] = useState<TenantConfig | null>(initialTenant);
  const [basePath, setBasePath] = useState(initialBasePath);
  const [loading, setLoading] = useState(!initialTenant);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setBasePath(initialBasePath);
  }, [initialBasePath]);

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
    <TenantContextObj.Provider value={{ tenant, basePath, loading, error }}>
      {children}
    </TenantContextObj.Provider>
  );
}

