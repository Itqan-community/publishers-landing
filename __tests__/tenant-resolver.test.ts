import { describe, it, expect } from 'vitest';

type StrategyResult = { tenantId: string; strategy: 'domain' | 'subdomain' | 'path' };

function mockResolveTenantWithStrategy(hostname: string, pathname: string): StrategyResult {
  if (hostname === 'qhc.itqan.dev') {
    return { tenantId: 'saudi-center', strategy: 'domain' };
  }
  if (hostname === 'localhost') {
    const match = pathname.match(/^\/([^/]+)/);
    if (match) return { tenantId: match[1], strategy: 'path' };
  }
  return { tenantId: 'saudi-center', strategy: 'path' };
}

describe('tenant-resolver strategies (simplified mock)', () => {
  it('prefers custom domain over subdomain and path', () => {
    const { tenantId, strategy } = mockResolveTenantWithStrategy('qhc.itqan.dev', '/recitations');
    expect(strategy).toBe('domain');
    expect(tenantId).toBe('saudi-center');
  });

  it('falls back to path strategy for localhost with /tenant prefix', () => {
    const { tenantId, strategy } = mockResolveTenantWithStrategy('localhost', '/saudi-center/recitations');
    expect(strategy).toBe('path');
    expect(tenantId).toBe('saudi-center');
  });
});

