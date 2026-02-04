/**
 * Helpers for debug-only behavior (localhost / staging).
 * Used by API routes to allow proxy and debug endpoints only in non-production.
 */

import type { NextRequest } from 'next/server';

/**
 * Returns true when the request is from localhost or a staging host (e.g. staging--*.netlify.app).
 * Use this to gate proxy and debug API routes so production stays secure.
 */
export function isDebuggableEnv(request: NextRequest): boolean {
  const host = request.headers.get('host') ?? request.nextUrl.hostname ?? '';
  if (!host) return false;
  const hostLower = host.split(':')[0].toLowerCase();
  if (hostLower === 'localhost' || hostLower === '127.0.0.1') return true;
  if (hostLower.startsWith('staging--')) return true;
  return false;
}
