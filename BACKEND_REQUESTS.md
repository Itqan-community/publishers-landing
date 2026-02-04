# Backend API Requests

Single source of truth for how and where we call the backend. **Same pattern everywhere**: on **localhost/staging** we fetch from the **client** (so requests show in the Network tab) with `backendUrl` + `Accept-Language: ar`; on **production** we fetch on the **server**. No mock data; no duplicate calls.

## Pattern per page

| Page / section | APIs used | Localhost/staging | Production |
|----------------|-----------|-------------------|------------|
| **Recitations listing** (`/[tenant]/recitations`) | `GET /recitations/`, `GET /riwayahs/` | `RecitationsListingClient` (client fetch with `backendUrl`) | Server: `getRecordedMushafs`, `getRiwayahs` |
| **Recitation detail** (`/[tenant]/recitations/[id]`) | `GET /recitations/?id=`, `GET /recitation-tracks/{id}/` | `RecitationDetailClient` (client fetch with `backendUrl`) | Server: `getRecitationById`, `getRecitationTracksByAssetId` |
| **Home – Recorded Mushafs + Featured** | `GET /recitations/`, `GET /recitation-tracks/{firstId}/` | `RecordedMushafsSectionClient` (client fetch with `backendUrl`) | Server: `getRecordedMushafs`, `getFeaturedRecitationTracks` |
| **Home – Reciters** | `GET /reciters` | `RecitersSectionClient` (client fetch with `backendUrl`) | Server: `getReciters` |

Client components receive **`backendUrl`** from the server (from `getBackendUrl(tenantId)` when `getDeployEnv() !== 'production'`) and call `fetch(backendUrl + path, { headers: { 'Accept': 'application/json', 'Accept-Language': 'ar' } })`. Each API is called **once** per page/section.

## Server-side libs (used only in production for these pages)

| Lib | API | Headers |
|-----|-----|---------|
| `lib/recorded-mushafs.ts` | `GET /recitations/`, `GET /recitations/?id=` | `getApiHeaders()` (Accept-Language: ar), cache: no-store |
| `lib/reciters.ts` | `GET /reciters` | same |
| `lib/riwayahs.ts` | `GET /riwayahs/` | same |
| `lib/recitation-tracks.ts` | `GET /recitation-tracks/{id}/` | same |

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
