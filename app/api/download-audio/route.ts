import { NextRequest, NextResponse } from 'next/server';

/**
 * Proxies audio download so the browser gets a file to save instead of opening in a new tab.
 * Use: GET /api/download-audio?url=<encoded-audio-url>&filename=<suggested-filename>
 * Server fetches the audio (no CORS) and streams it with Content-Disposition: attachment.
 */
export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url');
  const filename = request.nextUrl.searchParams.get('filename') || 'audio.mp3';

  if (!url || typeof url !== 'string') {
    return NextResponse.json({ error: 'Missing url' }, { status: 400 });
  }

  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return NextResponse.json({ error: 'Invalid url' }, { status: 400 });
  }

  if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
    return NextResponse.json({ error: 'Only http(s) URLs allowed' }, { status: 400 });
  }

  try {
    const res = await fetch(url, {
      headers: {
        'Accept': 'audio/*,*/*',
        'User-Agent': request.headers.get('user-agent') || 'NextJS-Download',
      },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `Upstream returned ${res.status}` },
        { status: res.status === 404 ? 404 : 502 }
      );
    }

    const contentType = res.headers.get('content-type') || 'audio/mpeg';
    const safeFilename = filename.replace(/[^\w\u0600-\u06FF\s.-]/gi, '_').trim() || 'audio.mp3';

    return new NextResponse(res.body, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${safeFilename}"`,
        'Cache-Control': 'private, no-cache',
      },
    });
  } catch (err) {
    console.error('[download-audio]', err);
    return NextResponse.json({ error: 'Download failed' }, { status: 502 });
  }
}
