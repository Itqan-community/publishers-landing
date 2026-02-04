import { NextRequest, NextResponse } from 'next/server';
import { isDebuggableEnv } from '@/lib/debug-env';
import { getBackendUrl } from '@/lib/backend-url';

/**
 * Returns backend config for the client when on localhost or staging, so the app
 * can show API requests in the Network tab. Returns 403 in production.
 *
 * Query: ?tenant=saudi-center (optional, for tenant-specific backend URL)
 */
export async function GET(request: NextRequest) {
  if (!isDebuggableEnv(request)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const tenantId = request.nextUrl.searchParams.get('tenant') || undefined;
  try {
    const backendBaseUrl = await getBackendUrl(tenantId);
    return NextResponse.json({
      proxyAvailable: true,
      proxyPrefix: '/api/backend',
      backendBaseUrl, // so client can show "real" URL in UI if needed
    });
  } catch (e) {
    console.error('[debug/backend-config]', e);
    return NextResponse.json({ error: 'Config failed' }, { status: 500 });
  }
}
