# Backend API Requests

Single source of truth for how and where we call the backend. No mock data; no duplicate client calls; all server-side fetches use `Accept-Language: ar` and `cache: 'no-store'`.

## Where backend is called (server-side only)

| Call site | API | Used by | Times per page |
|-----------|-----|---------|----------------|
| `lib/recorded-mushafs.ts` → `getRecordedMushafs` | `GET /recitations/?page=&page_size=&search=&riwayah_id=` | Recitations listing page, Home (SaudiCenterTemplate) | 1 per page |
| `lib/recorded-mushafs.ts` → `getRecitationById` | `GET /recitations/?id=` | Recitation detail page, getFeaturedRecitationTracks | 1 per usage (React cache dedupes within same request) |
| `lib/reciters.ts` → `getReciters` | `GET /reciters` | Home (SaudiCenterTemplate) | 1 per page |
| `lib/riwayahs.ts` → `getRiwayahs` | `GET /riwayahs/` | Recitations listing page | 1 per page |
| `lib/recitation-tracks.ts` → `getRecitationTracksByAssetId` | `GET /recitation-tracks/{id}/` | Recitation detail page, getFeaturedRecitationTracks | 1 per usage (React cache dedupes) |
| `lib/recitation-tracks.ts` → `getFeaturedRecitationTracks` | uses getRecitationById + getRecitationTracksByAssetId | Home (SaudiCenterTemplate) | 1 per page |

All of the above use **`getApiHeaders()`** from `lib/utils.ts`, which sets:
- `Content-Type: application/json`
- `Accept: application/json`
- **`Accept-Language: ar`**

All use **`cache: 'no-store'`** so Next.js does not cache the fetch.

## API routes that call external URLs

| Route | Outgoing request | Headers |
|-------|------------------|---------|
| `app/api/download-audio/route.ts` | `fetch(audioUrl)` | Accept, Accept-Language: ar, User-Agent, cache: no-store |


## What appears in the browser Network tab

- **On localhost / staging**: Listing and detail pages fetch data **directly from the client** (using `fetch(backendUrl + ...)`). So you see the real API traffic in the Network tab. Each API is called **once**; requests send `Accept-Language: ar`.
- **On production**: Listing and detail pages fetch on the server. The tab shows only the document request, images, and audio; backend API calls are server-to-server so they do not appear in the tab.
- **Images / audio**: Image and audio URLs loaded by the page will also appear when requested.

## Security

- Backend URL is resolved server-side via `getBackendUrl(tenantId)` (from `lib/backend-url.ts`). In development/staging, this is passed to the client for direct calls.
- No mock or hardcoded API responses; all data comes from the configured backend.
