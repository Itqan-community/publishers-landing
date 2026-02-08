'use client';

import React, { useEffect, useState } from 'react';
import { RecitersSection } from '@/components/sections/RecitersSection';
import { BouncingDots } from '@/components/ui/BouncingDots';
import type { ReciterCardProps } from '@/components/cards/ReciterCard';
import {
  mapRecitersApiToReciterCardProps,
  type ReciterApiResponse,
} from '@/lib/map-reciters-api';

interface RecitersSectionClientProps {
  tenantId: string;
  basePath: string;
  backendUrl: string;
  tenantDomain: string; // NEW: For X-Tenant header authentication
  id?: string;
  title: string;
  description: string;
  viewAllHref?: string;
}

export function RecitersSectionClient({
  tenantId,
  basePath,
  backendUrl,
  tenantDomain,
  id,
  title,
  description,
  viewAllHref,
}: RecitersSectionClientProps) {
  const [reciters, setReciters] = useState<ReciterCardProps[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const pathPrefix = basePath || `/${tenantId}`;
    const base = backendUrl.replace(/\/$/, '');

    async function load() {
      const url = `${base}/reciters`;

      // Include X-Tenant header for backend authentication
      const headers: HeadersInit = {
        'Accept': 'application/json',
        'Accept-Language': 'ar',
        'X-Tenant': tenantDomain,
      };

      try {
        const res = await fetch(url, { headers });
        if (cancelled) return;
        if (!res.ok) {
          setError(`Reciters: ${res.status}`);
          return;
        }

        const data = await res.json();
        const results: ReciterApiResponse[] = Array.isArray(data.results)
          ? data.results
          : [];
        const mapped = mapRecitersApiToReciterCardProps(results, base, pathPrefix);
        setReciters(mapped);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Failed to load');
      }
    }

    load();
    return () => { cancelled = true; };
  }, [tenantId, basePath, backendUrl, tenantDomain]);

  if (error) {
    return (
      <div className="py-12 text-center text-[18px] text-red-600" dir="rtl">
        {error}
      </div>
    );
  }

  if (reciters === null) {
    return (
      <div className="flex min-h-[30vh] items-center justify-center py-20" aria-label="جاري التحميل">
        <BouncingDots className="scale-150" />
      </div>
    );
  }

  return (
    <RecitersSection
      id={id}
      title={title}
      description={description}
      reciters={reciters}
      viewAllHref={viewAllHref}
    />
  );
}
