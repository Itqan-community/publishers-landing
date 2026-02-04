import { NextRequest, NextResponse } from 'next/server';
import { isDebuggableEnv } from '@/lib/debug-env';
import { getBackendUrl } from '@/lib/backend-url';

/**
 * Proxies GET requests to the backend API so they appear in the browser Network tab
 * when on localhost or staging. Disabled in production for security.
 *
 * Usage: GET /api/backend/recitations?id=123 with header X-Tenant-Id: saudi-center
 * Forwards to: {backendUrl}/recitations/?id=123
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path?: string[] }> }
) {
  if (!isDebuggableEnv(request)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const tenantId = request.headers.get('x-tenant-id') || request.nextUrl.searchParams.get('tenant') || undefined;
  const { path: pathSegments } = await params;
  const path = pathSegments?.length ? pathSegments.join('/') : '';
  const searchParams = new URLSearchParams(request.nextUrl.searchParams);
  searchParams.delete('tenant'); // do not forward to backend
  const search = searchParams.toString();
  const queryString = search ? `?${search}` : '';

  try {
    const backendUrl = await getBackendUrl(tenantId);
    const base = backendUrl.replace(/\/$/, '');
    const upstreamUrl = path ? `${base}/${path}/${queryString}` : `${base}/${queryString}`;

    const res = await fetch(upstreamUrl, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'User-Agent': request.headers.get('user-agent') || 'NextJS-Backend-Proxy',
      },
      next: { revalidate: 0 },
    });

    const contentType = res.headers.get('content-type') || 'application/json';
    const body = await res.text();

    return new NextResponse(body, {
      status: res.status,
      headers: {
        'Content-Type': contentType,
        'X-Backend-URL': upstreamUrl,
      },
    });
  } catch (err) {
    console.error('[api/backend]', err);
    return NextResponse.json({ error: 'Proxy failed' }, { status: 502 });
  }
}
