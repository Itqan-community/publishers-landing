import { NextRequest, NextResponse } from 'next/server';

const MAX_CONTENT_LENGTH_BYTES =
  Number(process.env.AUDIO_DOWNLOAD_MAX_BYTES || 50_000_000); // ~50MB default

function isPrivateOrLocalhostHost(hostname: string): boolean {
  const lower = hostname.toLowerCase();
  if (lower === 'localhost' || lower === '127.0.0.1') return true;
  if (/^10\./.test(lower)) return true;
  if (/^192\.168\./.test(lower)) return true;
  if (/^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(lower)) return true;
  return false;
}

function isHostAllowed(hostname: string): boolean {
  const raw = process.env.AUDIO_DOWNLOAD_ALLOWED_HOSTS || '';
  const allowed = raw
    .split(',')
    .map((h) => h.trim().toLowerCase())
    .filter(Boolean);

  // Security-first default: if no allowlist is configured, block external downloads.
  if (!allowed.length) {
    return false;
  }

  const host = hostname.toLowerCase();
  return allowed.includes(host);
}

/**
 * Proxies audio download: fetches the audio URL and returns it with
 * Content-Disposition: attachment so the browser saves the file.
 * GET /api/download-audio?url=<encoded-audio-url>&filename=<optional-filename>
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const audioUrl = searchParams.get('url');
  const filename = searchParams.get('filename') || 'track.mp3';

  if (!audioUrl) {
    return new Response('Missing url', { status: 400 });
  }

  let parsed: URL;
  try {
    parsed = new URL(audioUrl);
  } catch {
    return new Response('Invalid url', { status: 400 });
  }
  if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
    return new Response('Only http(s) URLs allowed', { status: 400 });
  }

   if (isPrivateOrLocalhostHost(parsed.hostname)) {
    return new Response('Target host not allowed', { status: 400 });
  }

  if (!isHostAllowed(parsed.hostname)) {
    return new Response('Host not allowed', { status: 400 });
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    const response = await fetch(audioUrl, {
      headers: {
        Accept: 'audio/*,*/*',
        'Accept-Language': 'ar',
        'User-Agent': req.headers.get('user-agent') || 'NextJS-Download',
      },
      cache: 'no-store',
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return new Response(`Upstream returned ${response.status}`, {
        status: response.status === 404 ? 404 : 502,
      });
    }

    const contentLengthHeader = response.headers.get('content-length');
    if (contentLengthHeader) {
      const contentLength = Number(contentLengthHeader);
      if (Number.isFinite(contentLength) && contentLength > MAX_CONTENT_LENGTH_BYTES) {
        return new Response('File too large', { status: 413 });
      }
    }

    const blob = await response.blob();
    const safeFilename = filename.replace(/[^\w\u0600-\u06FF\s.-]/gi, '_').trim() || 'track.mp3';

    return new Response(blob, {
      headers: {
        'Content-Type': response.headers.get('content-type') || 'audio/mpeg',
        'Content-Disposition': `attachment; filename="${safeFilename}"`,
      },
    });
  } catch (err) {
    console.error('[download-audio]', err);
    return new Response('Download failed', { status: 502 });
  }
}
