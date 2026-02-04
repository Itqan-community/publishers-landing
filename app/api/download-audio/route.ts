import { NextRequest, NextResponse } from 'next/server';

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

  try {
    const response = await fetch(audioUrl, {
      headers: {
        Accept: 'audio/*,*/*',
        'Accept-Language': 'ar',
        'User-Agent': req.headers.get('user-agent') || 'NextJS-Download',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      return new Response(`Upstream returned ${response.status}`, {
        status: response.status === 404 ? 404 : 502,
      });
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
