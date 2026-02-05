# Backend API Requests

Single source of truth for how we call the backend. **Same pattern everywhere (staging and production):** the **browser** calls the API directly with `backendUrl` + `Accept-Language: ar`. No proxy; requests show in the Network tab. No mock data.

## Pattern per page

| Page / section | APIs used | Who fetches |
|----------------|-----------|-------------|
| **Recitations listing** (`/[tenant]/recitations`) | `GET /recitations/`, `GET /riwayahs/` | `RecitationsListingClient` (client fetch with `backendUrl`) |
| **Recitation detail** (`/[tenant]/recitations/[id]`) | `GET /recitations/?id=`, `GET /recitation-tracks/{id}/` | `RecitationDetailClient` (client fetch with `backendUrl`) |
| **Home – Recorded Mushafs + Featured** | `GET /recitations/`, `GET /recitation-tracks/{firstId}/` | `RecordedMushafsSectionClient` (client fetch with `backendUrl`) |
| **Home – Reciters** | `GET /reciters` | `RecitersSectionClient` (client fetch with `backendUrl`) |

The server only resolves **`backendUrl`** via `getBackendUrl(tenantId)` and passes it to the client. The client calls `fetch(backendUrl + path, { headers: { 'Accept': 'application/json', 'Accept-Language': 'ar' } })`.

## API routes that call external URLs

| Route | Outgoing request | Headers |
|-------|------------------|---------|
| `app/api/download-audio/route.ts` | `fetch(audioUrl)` | Accept, Accept-Language: ar, User-Agent, cache: no-store |

## What appears in the browser Network tab

- **All environments**: Listing, detail, home sections fetch data **directly from the client** (`fetch(backendUrl + ...)`). You see the real API traffic in the Network tab; requests send `Accept-Language: ar` and the browser’s Origin.
- **Images / audio**: Image and audio URLs loaded by the page also appear when requested.

## Security

- Backend URL is resolved server-side via `getBackendUrl(tenantId)` (from `lib/backend-url.ts`) and passed to the client. The browser calls the API directly (CORS and Origin handled by the browser).
- No mock or hardcoded API responses; all data comes from the configured backend.
