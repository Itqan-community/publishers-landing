# Comprehensive Project Review

**Date:** February 1, 2026  
**Scope:** Full codebase review — every file and line considered.  
**Purpose:** Document understanding, gaps, issues, improvements, and a plan to achieve excellence.

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [What I Understand](#2-what-i-understand)
3. [What’s Missing](#3-whats-missing)
4. [What’s Wrong](#4-whats-wrong)
5. [What Could Be Better](#5-what-could-be-better)
6. [SSR & SEO](#6-ssr--seo)
7. [Performance](#7-performance)
8. [Best Practices](#8-best-practices)
9. [Plan to Achieve Perfection](#9-plan-to-achieve-perfection)
10. [File-by-File Notes](#10-file-by-file-notes)
11. [Recommendations Summary](#11-recommendations-summary)

---

## 1. Executive Summary

This is a **multi-tenant landing platform** built with Next.js 15 (App Router), TypeScript, and Tailwind CSS. It started as a generic “publisher landing” system and has been extended with a **Saudi Center for Quranic Recitations** product: RTL/Arabic-first UI, recitations listing, recitation detail pages with an audio player, recorded mushafs, reciters, and sponsors.

**Strengths:** Clear architecture (tenant resolution, templates, theme system), good RTL/accessibility patterns, **server-first rendering (SSR)**, type safety, and strong documentation.

**Main gaps:** No automated tests, backend URL hardcoded, excessive `console.*` in production paths, some hardcoded tenant paths and mock data, docs not fully aligned with current routes/features; **SSR and SEO** can be strengthened (metadata on all routes, sitemap, structured data, crawlability).

**Priority fixes:** Use env for API URL, remove or gate debug logging, make not-found and shared copy tenant-aware, document `[tenant]` and recitations routes, then add tests, **SSR & SEO** hardening (see §6), **performance** and **best-practices** passes, and polish (error boundaries, loading/error UI).

---

## 2. What I Understand

### 2.1 Architecture

- **Request flow:** Middleware adds `x-hostname` and `x-pathname` to headers → Page resolves tenant via `getTenantFromHeaders()` (root `/`) or from `[tenant]` segment → `loadTenantConfig(tenantId)` (with in-memory cache) → Template chosen by `tenant.template` → Sections render with tenant content.
- **Tenant resolution order:** Custom domain → subdomain → path-based (first segment). Path-based enables `/saudi-center`, `/saudi-center/recitations`, `/saudi-center/recitations/[id]` without subdomains.
- **Default tenant:** When no strategy matches (e.g. `localhost/`), `getDefaultTenantId()` returns `process.env.DEFAULT_TENANT_ID || 'saudi-center'`.

### 2.2 Routes

| Route | Purpose |
|-------|--------|
| `/` | Home; tenant from headers (default tenant on localhost). |
| `/[tenant]` | Home for that tenant (e.g. `/saudi-center`). |
| `/[tenant]/recitations` | Recitations listing (recorded mushafs). |
| `/[tenant]/recitations/[recitationId]` | Recitation detail + audio player (tracks from API). |

`generateStaticParams` on `[tenant]/page.tsx` uses `getAllTenantIds()` so static generation can prebuild tenant home pages.

### 2.3 Templates

- **default:** Hero, Statistics, Asset Categories, Speakers, Footer (generic publisher).
- **magazine:** Hero, Statistics, Asset Categories, Footer (no Speakers).
- **minimal:** Not implemented; registry points to Default.
- **saudi-center:** Full Saudi Center flow: Hero, Partners, About, Recorded Mushafs, Featured Recitations, Reciters, Sponsors, Statistics; uses `PageLayout` (Header + Footer). Data comes from `getReciters`, `getRecordedMushafs`, `getFeaturedRecitationTracks` (latter is mock).

### 2.4 Data

- **Tenants:** `config/tenants.json`; keys are tenant IDs. Validated for `id`, `name`, `branding`, `features`, `content`, `cmsLinks`, `template`; branding must have `primaryColor`/`secondaryColor`, content must have `hero` and `footer`.
- **Backend API:** Base URL from `getBackendUrl()` in `lib/utils.ts` — currently **hardcoded** to `https://develop.api.cms.itqan.dev` (env override commented out). Endpoints used:
  - `GET /recitations/` → list of recitations (recorded mushafs).
  - `GET /recitations/?id={id}` → single recitation (used by `getRecitationById`).
  - `GET /recitation-tracks/{asset_id}/` → tracks for a recitation (surahs).
  - `GET /reciters` → list of reciters (no trailing slash in code; API may expect `/reciters/`).

### 2.5 Theming & RTL

- **globals.css:** Defines design tokens (primary green `#193624`, gold `#faaf41`, radii, shadows, `--font-primary` with IBM Plex Sans Arabic).
- **Runtime theming:** `getThemeStyles(tenant.branding)` for SSR; `ThemeProvider` calls `applyThemeVariables(branding)` on the client. Tailwind uses `var(--color-primary)` etc.
- **RTL:** Root layout has `lang="ar" dir="rtl"`; project rules require logical properties (start/end, ms/me). Most UI follows this; a few components still use `left`/`right` (e.g. Carousel arrows).

### 2.6 Key Components

- **PageLayout:** Wraps Header + main + Footer; used by Saudi Center template and recitations pages. Header gets `navItems` with `/{tenant.id}`, `/#about`, `/{tenant.id}/recitations`, `/#reciters`.
- **Header:** Client component; mobile menu, scroll-based background; logo and nav are tenant-aware.
- **Footer:** Two variants: `template === 'saudi-center'` (custom layout, tagline, contact, social, policy links) vs default (logo, link columns, social, copyright).
- **RecitationsPlayer:** Client component; list + player (progress, play/pause/prev/next); supports “featured” and “details” variants. Uses native `<audio>` and validates/normalizes audio URLs.
- **Carousel:** Embla; RTL direction; used for mushafs, reciters, “other mushafs” on recitation detail.

### 2.7 Types

- **types/tenant.types.ts:** TenantConfig, TenantBranding, TenantFeatures, TenantContent, CMSLinks, section content types, RecordedMushaf, TemplateType (`'default' | 'magazine' | 'minimal' | 'saudi-center'`), TenantResolutionStrategy, TenantRequest, TenantContext. FooterContent has `links: { label, items: { text, href }[] }[]`.

---

## 3. What’s Missing

### 3.1 Testing

- No `test` or `jest` / `vitest` script in `package.json`.
- No unit tests for tenant-resolver, tenant-config, theme, or data fetchers.
- No integration tests for pages or API usage.
- No E2E tests (e.g. Playwright/Cypress) for critical flows (tenant home, recitations list, recitation detail, audio).

### 3.2 Configuration & Environment

- **Backend URL:** `getBackendUrl()` ignores `NEXT_PUBLIC_API_URL` and always returns the develop URL. Env-based selection is commented out.
- **env.example** documents many variables (DEFAULT_TENANT_ID, API URL, feature flags, etc.) but the app only uses DEFAULT_TENANT_ID and does not yet use NEXT_PUBLIC_API_URL.

### 3.3 Templates & Routes in Docs

- **STRUCTURE.md** and **README.md** describe a single “main landing page” and do not mention:
  - Dynamic segment `[tenant]`.
  - Recitations routes (`/[tenant]/recitations`, `/[tenant]/recitations/[recitationId]`).
  - Saudi Center template and its sections (Partners, About, Recorded Mushafs, Featured Recitations, Reciters, Sponsors).
- **DOCS_INDEX.md** and **VISUAL_GUIDE.md** also omit these.

### 3.4 Minimal Template

- `TemplateType` includes `'minimal'` and registry maps it to DefaultTemplate. There is no dedicated minimal layout; either implement one or remove from the type and registry.

### 3.5 Error & Loading UX

- No `error.tsx` or `loading.tsx` in `app/` or under `app/[tenant]` or `app/[tenant]/recitations`. Errors and loading states are not standardized.

### 3.6 SEO & Metadata

- No sitemap (e.g. `app/sitemap.ts`) for tenant and recitation URLs.
- No `robots.txt` or tenant-specific robots rules.
- Recitations listing and detail pages could expose richer metadata (e.g. JSON-LD for audio).

### 3.7 Security & Resilience

- No rate limiting in middleware.
- No Content-Security-Policy or other security headers in `next.config.ts` (only X-DNS-Prefetch-Control).
- No explicit error boundary; uncaught errors in server or client components can surface raw error UI.

### 3.8 Recitation Detail Page

- “المصاحف الأخرى” (other mushafs) is **hardcoded** in `app/[tenant]/recitations/[recitationId]/page.tsx` (`otherMushafs` array). It should be derived from API (e.g. same recitations list minus current) or from config.

### 3.9 API Contract Assumptions

- `getRecitationById` uses `GET /recitations/?id={recitationId}`. If the backend later uses `GET /recitations/{id}/`, the client will need updating.
- Recitation tracks response shape is assumed (e.g. `results` array, `duration_ms`, `audio_url`). No shared type or validation layer between API and app.

### 3.10 Performance Gaps

- No Core Web Vitals (LCP, INP, CLS) monitoring or targets.
- No `loading.tsx` or skeletons; first paint can show blank or layout shift.
- Hero image may lack `priority` or optimal `sizes` on some templates.
- Fonts: root uses `next/font` (IBM Plex Sans Arabic) but tenant branding injects external Google Font `<link>` (Inter, Roboto) — duplicate/blocking requests possible.
- No dynamic imports for below-the-fold client components (e.g. Carousel, AudioPlayer).
- Recitations list: no pagination or virtualization; large lists render all items.
- No fetch `revalidate` strategy documented; some fetches use `next: { revalidate: 300 }` but no ISR/on-demand invalidation story.
- Middleware runs on every matched request; no lightweight early-exit for static assets beyond matcher.

### 3.11 Best-Practices Gaps

- No documented “Server vs Client” decision log; a few components could be server-rendered with client islands.
- No ESLint rules for `'use client'` usage or image `alt`/`sizes`.
- No accessibility (a11y) audit or axe/Lighthouse a11y baseline.
- No security headers (CSP, X-Frame-Options, etc.) beyond DNS prefetch.
- No input validation/sanitization layer for tenant ID or recitation ID from URL.
- No documented error-handling strategy (when to throw, when to return null, when to show UI).
- No shared constants for magic numbers (e.g. revalidate 300, timeout 10000).

### 3.12 SSR Gaps

- No single “SSR strategy” doc: which routes are fully server-rendered, which use client islands, and why.
- Recitations listing and detail pages do not export `generateMetadata`; crawlers get generic or root metadata.
- Client-only content: RecitationsPlayer list and Carousel slides are rendered on server as part of parent, but interactive state (selected track, playing) is client-only — ensure critical text (titles, reciter names) is in the initial HTML so crawlers see it.
- No use of React `Suspense` or streaming for slow data (e.g. recitation tracks); entire page waits for all data before sending HTML.
- `generateStaticParams` for `[tenant]` exists; no static params for `[tenant]/recitations/[recitationId]` (could prebuild top N recitations for SEO).

### 3.13 SEO Gaps

- No sitemap: search engines cannot discover all tenant and recitation URLs in one place.
- No `robots.txt` or `app/robots.ts`: crawl directives not defined.
- Recitations listing page: no `<title>`, `<meta name="description">`, or Open Graph; same for recitation detail (critical for sharing and indexing).
- No structured data (JSON-LD): no Organization, no AudioObject or MusicRecording for recitations — missing rich result potential.
- No canonical URLs: if same content is reachable via multiple paths (e.g. `/` vs `/[default-tenant]`), canonical should be set.
- Core Web Vitals (LCP, CLS) affect ranking; no baseline or targets documented for key routes.

---

## 4. What’s Wrong

### 4.1 Production Logging

- **~113 `console.log` / `console.warn` / `console.error`** across 9 files (e.g. `lib/recitation-tracks.ts`, `lib/recorded-mushafs.ts`, `app/[tenant]/recitations/[recitationId]/page.tsx`, `components/audio/AudioPlayer.tsx`, `app/page.tsx`, `app/[tenant]/page.tsx`, `lib/tenant-resolver.ts`, `lib/tenant-config.ts`). These run in production and clutter logs; they should be removed or gated (e.g. `process.env.NODE_ENV === 'development'` or a small logger utility).

### 4.2 Backend URL Not Configurable

- **lib/utils.ts:** `getBackendUrl()` always returns `'https://develop.api.cms.itqan.dev'`. The commented block that uses `NEXT_PUBLIC_API_URL` and env-based URLs should be restored so staging/production can point to the correct API.

### 4.3 Not-Found Page Not Tenant-Aware

- **app/not-found.tsx:** Uses fixed copy (“Tenant Not Found”), “Go to Default Site” linking to `/`, and hardcoded blue button. It does not use tenant context or tenant-specific home link (e.g. redirect to `/{defaultTenantId}` or show tenant branding).

### 4.4 Hardcoded Tenant Paths in Sections

- **HeroSection:** “تصفح القراء” links to `/saudi-center/reciters` and “استمع الان” to `ctaLink || '/saudi-center/recitations'`. For a multi-tenant app, these should use `tenant.id` (e.g. `/${tenant.id}/reciters`). Hero receives `content` but not `tenantId`; either pass tenant id into HeroSection or derive from context.
- **FeaturedRecitationsSection:** `viewAllHref="/saudi-center/recitations"` is hardcoded in SaudiCenterTemplate; it already has `viewAllHref` prop — the template passes `viewAllHref={`/${tenant.id}/recitations`}` for “عرض الكل” but for FeaturedRecitationsSection it passes `viewAllHref="/saudi-center/recitations"` — should be `/${tenant.id}/recitations`.

### 4.5 Inconsistent Language / Tenant Branding

- **FooterSection (default):** “Terms of Service” and “Privacy Policy” are in English while the app is RTL/Arabic-first; should be localized or driven by tenant.
- **AssetCategoriesSection / SpeakersSection:** Headings “Explore Our Collections”, “Meet Our Speakers”, “Discover a world of content…” are English; rest of Saudi Center is Arabic. Either make these tenant/content-driven or align with locale.

### 4.6 Theme Type in theme.ts

- **lib/theme.ts:** `getThemeStyles` returns `React.CSSProperties` but the file does not import `React`. With `@types/react` this can still type-check; for clarity and tree-shaking, use `import type { CSSProperties } from 'react'` and return `CSSProperties`.

### 4.7 Reciters API Path

- **lib/reciters.ts:** Request is sent to `${backendUrl}/reciters` (no trailing slash). If the backend expects `/reciters/`, some environments could 301/302. recorded-mushafs and recitation-tracks use trailing slashes; reciters should be consistent (prefer trailing slash if that’s the API contract).

### 4.8 Carousel Arrow Positioning

- **components/ui/Carousel.tsx:** Uses `right-4` and `left-4` for arrow buttons. Project rules prefer logical properties (e.g. `end-4` / `start-4`) for RTL safety.

### 4.9 ReciterCard Layout

- **components/cards/ReciterCard.tsx:** Uses `left-[13px] right-[13px] bottom-[16px]`. Prefer `inset-inline-*` and `bottom-*` (or logical equivalent) for RTL consistency.

### 4.10 Performance Issues

- **PartnersSection** uses `<img>` instead of `next/image` — no optimization, no lazy loading, no `sizes`.
- **Recitation detail page** renders a long list of “other mushafs” and a full RecitationsPlayer; no code splitting or lazy hydration for below-the-fold player on mobile.
- **HeroSection** and **SaudiCenterTemplate** load multiple sections and data in one pass; SaudiCenterTemplate does `Promise.all` for reciters/mushafs/featured tracks — good, but no streaming or partial UI for slow endpoints.
- **Fonts:** Tenant `getFontLink(tenant.branding.font)` injects a blocking `<link>` for Google Fonts even when root already uses `next/font` (IBM Plex Sans Arabic); Saudi Center uses “inter” in config but layout uses Arabic font — redundant or conflicting font loading.
- **AudioPlayer** is a large client component; not lazy-loaded, so it increases initial JS for any page that includes it.
- **Carousel** (Embla) and **RecitationsPlayer** ship on every page that uses them; no dynamic `next/dynamic` with `ssr: false` where appropriate (e.g. carousel below the fold).

### 4.11 Best-Practices Violations

- **Console in production:** ~113 `console.*` calls; production code should use a logger or strip logs.
- **Magic numbers:** `revalidate: 300`, `setTimeout(..., 10000)` for fetch timeouts, `PAGE_SIZE = 12` in one file only — should be centralized constants.
- **Error handling:** Data fetchers return `[]` or `null` on failure without structured error type; pages use `notFound()` but don’t report or log for monitoring.
- **Tenant ID from URL:** `[tenant]` and `[recitationId]` are used in fetch without strict validation (e.g. allowlist or regex); risk of SSRF or bad requests if IDs are passed through to API.
- **Semantic HTML:** Some sections use generic `<div>` where `<section>`, `<article>`, or `<nav>` would improve accessibility and SEO.
- **Focus management:** Modal/mobile menu in Header doesn’t trap focus or restore focus on close; carousel and audio controls don’t declare `aria-live` for state changes.

### 4.12 SSR Issues

- **Recitations listing (`app/[tenant]/recitations/page.tsx`):** No `generateMetadata`; page is server-rendered but `<title>` and meta come from root layout only — poor SEO for “المصاحف المسجلة” and per-tenant listing.
- **Recitation detail (`app/[tenant]/recitations/[recitationId]/page.tsx`):** No `generateMetadata`; reciter name, recitation name, and track list are in the initial HTML (good), but social/share metadata (OG, Twitter) are missing — weak for sharing and indexing.
- **SaudiCenterTemplate:** Async server component that fetches data and renders; good. But it wraps content in client `TenantProvider`/`ThemeProvider`; the actual section content (Hero, About, RecordedMushafs, etc.) is server-rendered inside — ensure no critical text is only rendered inside client components (currently OK; RecitationsPlayer receives data as props and list titles are in HTML).
- **Root layout metadata:** Generic “Multi-Tenant Landing Platform”; every route that doesn’t export its own metadata falls back to this — recitations routes must export metadata.

### 4.13 SEO Issues

- **Missing metadata on key routes:** Recitations listing and detail do not set `title`, `description`, `openGraph`, or `twitter` — crawlers and social shares get default or empty values.
- **No sitemap or robots:** Search engines rely on discovery via links; a sitemap would speed indexing of all tenants and recitations; robots would clarify allowed/disallowed paths.
- **No JSON-LD:** Recitation detail page could expose `AudioObject` or `MusicRecording` (and Organization for tenant) for rich results in search; currently none.
- **Semantic structure:** Some sections use `<div>` instead of `<section>`/`<article>`; heading hierarchy is mostly correct (h1 → h2) but landmark roles would help crawlers and a11y.

---

## 5. What Could Be Better

### 5.1 Code Quality

- **Single source of truth for API base URL:** One place (e.g. `lib/api.ts` or `lib/utils.ts`) that reads env and is used by all data fetchers.
- **Shared API types:** Define DTOs for recitations, reciters, tracks in a dedicated module (e.g. `types/api.ts`) and reuse in lib and components; consider runtime validation (e.g. Zod) for API responses.
- **Logger utility:** Replace raw `console.*` with a small logger that respects `NODE_ENV` or `DEBUG` and log levels.

### 5.2 Performance

- See **[§7 Performance](#7-performance)** for the full audit. Summary: LCP (hero image, fonts), CLS (loading states, image dimensions), JS bundle (client components, dynamic import), caching (fetch revalidate, config cache), list size (pagination/virtualization). Recitations list should consider pagination or virtual list; all meaningful images should use `next/image` with `sizes` and `priority` for above-the-fold; unify font loading (prefer `next/font` and avoid duplicate tenant `<link>` when root font is used).

### 5.3 Accessibility

- **Focus and keyboard:** Carousel arrows and audio controls are focusable; ensure visible focus ring (e.g. `focus:ring-2 focus:ring-primary`) and no trap.
- **Live regions:** When the selected recitation or play state changes, consider `aria-live` for screen readers.
- **Alt text:** Some decorative images use `alt=""`; ensure all meaningful images have descriptive alt (e.g. reciter names, mushaf titles).

### 5.4 Maintainability

- **Feature flags:** env.example mentions ENABLE_SUBDOMAIN_RESOLUTION etc.; implementing these in tenant-resolver would allow turning strategies off without code changes.
- **Centralized copy:** Arabic/English strings are scattered; consider a simple i18n or constants file per section so copy and future locale support are easier.
- **Documentation:** Keep README, STRUCTURE, ARCHITECTURE, and VISUAL_GUIDE in sync with actual routes, templates, and data flow (including [tenant] and recitations).

### 5.5 Saudi Center Specifics

- **Sponsors and Partners:** Currently hardcoded in SaudiCenterTemplate and PartnersSection; consider moving to tenant content or a small config/CMS so non-developers can update.
- **About features:** `aboutFeatures` in SaudiCenterTemplate is inline; could live in tenant config or CMS for flexibility.

### 5.6 Best Practices (Summary)

- See **[§8 Best Practices](#8-best-practices)** for the full audit. Summary: Next.js (App Router, metadata, middleware), React (server-first, client only when needed), TypeScript (strict, no `any`), accessibility (focus, ARIA, semantic HTML), security (headers, input validation), SEO (metadata, sitemap, semantic markup), RTL/i18n (logical props, centralized copy), code style (logger, constants, error strategy).

---

## 6. SSR & SEO

This section ensures the app is **SSR-powerful** (all crawlable content server-rendered, fast first paint, no JS required for critical content) and **SEO-powerful** (metadata on every route, sitemap, robots, structured data, semantic HTML, Core Web Vitals).

### 6.1 Server-Side Rendering (SSR)

**Goal:** Every page sends full, crawlable HTML on first request. No critical content is hidden behind client-only rendering.

#### 6.1.1 Current SSR Coverage

| Route / Area | Server-rendered? | Notes |
|--------------|------------------|--------|
| `/` (root) | ✅ | Page is server component; tenant resolved and config loaded on server; template and sections render on server. |
| `/[tenant]` | ✅ | Same; params.tenant used on server; `generateStaticParams` can prebuild. |
| `/[tenant]/recitations` | ✅ | Page is server component; `getRecordedMushafs(tenantId)` on server; RecitationsPageContent is client but receives mushafs as props — list data is in initial HTML. |
| `/[tenant]/recitations/[recitationId]` | ✅ | Page is server component; recitation and tracks fetched on server; RecitationsPlayer is client but receives tracks as props — track titles and reciter name are in initial HTML. |
| SaudiCenterTemplate | ✅ | Async server component; fetches reciters, mushafs, featured tracks on server; sections (Hero, About, RecordedMushafs, etc.) are server-rendered; only providers and interactive components (Carousel, RecitationsPlayer) are client. |
| DefaultTemplate / MagazineTemplate | ✅ | Synchronous server components; content from tenant config; only SpeakersSection (and providers) are client. |

**Conclusion:** Critical content (titles, descriptions, list items, reciter names) is server-rendered. Client components (TenantProvider, ThemeProvider, Header, RecitationsPlayer, Carousel) receive data as props and render that data in the initial HTML where it’s visible to crawlers. **SSR is in good shape;** gaps are metadata and optional streaming.

#### 6.1.2 SSR Gaps and Hardening

| Gap | Action |
|-----|--------|
| **Metadata** | Every route that can be indexed must export `generateMetadata` (or static `metadata`) so `<title>`, `<meta name="description">`, and Open Graph are correct. Today root and `[tenant]` have it; recitations listing and detail do not. |
| **Streaming / Suspense** | Optional: wrap slow data (e.g. recitation tracks) in `<Suspense>` and stream HTML so hero and shell render first; crawlers still get full content when stream completes. |
| **Static generation** | `generateStaticParams` for `[tenant]` is used; consider `generateStaticParams` for `[tenant]/recitations/[recitationId]` (e.g. top N recitation IDs per tenant) so key detail pages are prebuilt and cached. |
| **Document SSR strategy** | Add a short “SSR & data fetching” subsection in ARCHITECTURE: which routes are server vs client, where data is fetched, and why client boundaries are used (interactivity only). |

#### 6.1.3 SSR Checklist

- [ ] All indexable routes export `generateMetadata` (or `metadata`) with at least `title` and `description`.
- [ ] No critical, crawlable text is rendered only inside a client component without being passed as props from server (current setup is OK).
- [ ] Optional: use `Suspense` for slow data to improve TTFB and streaming.
- [ ] Optional: `generateStaticParams` for recitation detail for top N IDs per tenant.
- [ ] Document SSR and client-boundary decisions in ARCHITECTURE.

### 6.2 Search Engine Optimization (SEO)

**Goal:** Maximize discoverability, correct indexing, and rich results: metadata, sitemap, robots, structured data, semantic HTML, and performance (CWV).

#### 6.2.1 Metadata (Title, Description, OG, Twitter)

| Route | Current | Target |
|-------|---------|--------|
| Root `/` | From `generateMetadata` (tenant from headers) | ✅ Keep; ensure default tenant case has sensible title/description. |
| `/[tenant]` | From `generateMetadata` | ✅ Good. |
| `/[tenant]/recitations` | **None** (falls back to root layout) | Add `generateMetadata`: title e.g. “المصاحف المسجلة | {tenant.name}”, description from config or fixed copy, OG image from tenant. |
| `/[tenant]/recitations/[recitationId]` | **None** | Add `generateMetadata`: title e.g. “{recitation.name} | {reciterName} | {tenant.name}”, description (recitation/reciter), OG image (reciter or tenant). |

**Actions:** Implement `generateMetadata` in `app/[tenant]/recitations/page.tsx` and `app/[tenant]/recitations/[recitationId]/page.tsx`; use async and load tenant/recitation as needed; return `title`, `description`, `openGraph`, `twitter`, and `icons` where applicable.

#### 6.2.2 Sitemap and Robots

- **Sitemap:** Add `app/sitemap.ts` (or `app/sitemap.xml/route.ts`). Use `getAllTenantIds()` and, if feasible, fetch recitation IDs per tenant (or top N), and output `url` entries with `lastModified`, `changeFrequency`, `priority`. Base URL from `NEXT_PUBLIC_BASE_URL` or request.
- **Robots:** Add `app/robots.ts` (or `public/robots.txt`) to allow all (or restrict admin/api), and reference the sitemap URL.

#### 6.2.3 Structured Data (JSON-LD)

- **Organization:** On tenant home (and optionally layout), add JSON-LD `Organization` with name, url, logo from tenant config.
- **Recitation detail:** Add `AudioObject` or `MusicRecording` with name, description, performer (reciter), duration, contentUrl (audio URL) for the selected or first track — enables rich results in search where supported.
- **BreadcrumbList:** Optional: Home → Tenant → Recitations → Recitation name.

Implement by rendering a `<script type="application/ld+json">` in the page or layout with the JSON-LD object(s).

#### 6.2.4 Semantic HTML and Landmarks

- Use `<main>` for primary content (already in PageLayout), `<nav>` for header nav, `<footer>` for footer, `<section>` with `aria-labelledby` for each section.
- Ensure one `<h1>` per page; section headings use `<h2>`/`<h3>` in order. This helps crawlers and accessibility.

#### 6.2.5 Canonical and Alternate

- If the same logical page is reachable via multiple URLs (e.g. `/` for default tenant vs `/[default-tenant]`), set `<link rel="canonical" href="...">` to the preferred URL (e.g. always `/[tenant]` for tenant home).
- For future i18n/locale: add `hreflang` and alternate links.

#### 6.2.6 SEO and Performance

- Core Web Vitals (LCP, INP, CLS) are ranking signals. See **[§7 Performance](#7-performance)** for targets and fixes (hero image, fonts, loading states). Fast, stable pages rank and index better.

#### 6.2.7 SEO Checklist

- [ ] Every indexable route has `generateMetadata` with `title`, `description`, `openGraph` (title, description, images), and optional `twitter`.
- [ ] `app/sitemap.ts` (or equivalent) lists all tenant and recitation URLs.
- [ ] `app/robots.ts` (or `public/robots.txt`) allows crawlers and points to sitemap.
- [ ] JSON-LD: Organization on tenant home; AudioObject/MusicRecording on recitation detail.
- [ ] Semantic HTML: `<main>`, `<nav>`, `<footer>`, `<section>`; heading hierarchy.
- [ ] Canonical URL where duplicate URLs exist.
- [ ] CWV targets met (see Performance section).

### 6.3 SSR & SEO Summary

- **SSR:** Already strong; ensure metadata on all routes, document strategy, optionally add Suspense/static params.
- **SEO:** Add metadata on recitations listing and detail; add sitemap and robots; add JSON-LD for Organization and recitation audio; use semantic HTML and canonical where needed; tie to CWV.

---

## 7. Performance

This section is a **performance audit** and checklist. Apply it in order: measure first, then fix.

### 7.1 Core Web Vitals (CWV)

| Metric | Target | Current / Notes |
|--------|--------|-----------------|
| **LCP** (Largest Contentful Paint) | &lt; 2.5s | Hero image and fonts drive LCP. Ensure hero uses `next/image` with `priority` and correct `sizes`; avoid blocking font `<link>` where `next/font` is already used. |
| **INP** (Interaction to Next Paint) | &lt; 200ms | Minimize client JS on critical path; lazy-load AudioPlayer and Carousel if below the fold. |
| **CLS** (Cumulative Layout Shift) | &lt; 0.1 | Reserve space for images (width/height or aspect-ratio); use `loading.tsx` or skeletons so content doesn’t jump. |

**Actions:** Run Lighthouse (or PageSpeed Insights) on `/`, `/[tenant]`, and `/[tenant]/recitations`; record LCP, INP, CLS. Fix images and fonts first, then re-measure.

### 7.2 Server vs Client and JS Bundle

- **Server components by default:** Most of the app is server-rendered; TenantProvider, ThemeProvider, Header (mobile menu), RecitationsPlayer, Carousel, and sections that use them are client. This is mostly correct.
- **Client bundle size:** Identify heavy client chunks (e.g. Embla, react-h5-audio-player if used, AudioPlayer). Use `next/dynamic` with `ssr: false` for below-the-fold carousels and the recitations player on listing/detail pages so the initial HTML doesn’t wait on them.
- **Recommendation:** Lazy-load `RecitationsPlayer` and `Carousel` where they are below the fold (e.g. `dynamic(() => import('@/components/audio/AudioPlayer'), { ssr: false })` for player on detail page if it’s not above the fold on mobile).

### 7.3 Images

| Location | Issue | Action |
|----------|--------|--------|
| Hero (all templates) | Must be LCP-optimized | Use `next/image` with `priority`, `sizes` (e.g. `(max-width: 1024px) 100vw, 50vw`). Already used in HeroSection; verify `sizes` and `priority` on all hero images. |
| PartnersSection | Uses `<img>` | Replace with `next/image`; add `sizes` and `loading="lazy"`. |
| MushafCard, ReciterCard, avatars | Various | All use `next/image`; ensure `sizes` is set (e.g. card width) to avoid overfetching. |
| Favicon / logos | Small assets | Keep as-is; ensure favicon is cached. |

### 7.4 Fonts

- **Current:** Root layout uses `next/font/google` (IBM Plex Sans Arabic). Pages also inject `<link href={getFontLink(tenant.branding.font)} />` (Inter, Roboto, etc.). For Saudi Center, tenant font is “inter” but the app is Arabic-first and root already sets Arabic font — the extra `<link>` is redundant and can block render.
- **Action:** For RTL/Arabic tenants, do not inject tenant font link when it would duplicate or conflict with root font. Option: only inject `getFontLink` when `tenant.branding.font` is not the same as the root font family, or use `next/font` for all fonts and map tenant font key to a font variable.

### 7.5 Data Fetching and Caching

- **Tenant config:** In-memory cache (Map) is good; no TTL — acceptable for JSON config. If configs are updated at runtime, consider invalidation or TTL.
- **API fetches (recitations, reciters, tracks):** Use `next: { revalidate: 300 }` (or env-driven). Consider `revalidate` per route (e.g. listing 300s, detail 60s) and document in ARCHITECTURE.
- **Parallel vs sequential:** SaudiCenterTemplate correctly uses `Promise.all` for reciters, mushafs, featured tracks. Recitation detail page fetches recitation then tracks; could run in parallel if recitation ID is known from listing (e.g. pass in or refetch in parallel).

### 7.6 Lists and Long Content

- **Recitations listing:** Renders all filtered items up to “load more” (PAGE_SIZE 12, then increment). For large lists (100+ items), consider virtualization (e.g. `react-virtual` or windowing) or cursor-based pagination to reduce DOM and re-renders.
- **Carousels:** Embla only renders visible slides; acceptable. Ensure carousel items don’t load heavy images for off-screen slides if they’re in the DOM (lazy loading on images handles this with `loading="lazy"`).

### 7.7 Middleware and Static Assets

- Middleware matcher excludes `_next/static`, `_next/image`, `favicon.ico`, and paths with extensions — good. No change needed unless adding auth or geo; keep middleware thin.

### 7.8 Performance Checklist (Summary)

- [ ] Measure LCP, INP, CLS on key routes; set targets (e.g. LCP &lt; 2.5s, CLS &lt; 0.1).
- [ ] Hero: `next/image` + `priority` + `sizes` on all templates.
- [ ] Replace `<img>` in PartnersSection (and anywhere else) with `next/image`.
- [ ] Unify font loading: avoid duplicate/blocking tenant font when root font is used.
- [ ] Lazy-load below-the-fold client components (RecitationsPlayer, Carousel) with `next/dynamic` where appropriate.
- [ ] Document or centralize `revalidate` and fetch timeouts; consider per-route revalidate.
- [ ] For recitations list, add pagination or virtualization if list size grows (e.g. &gt; 50 items).
- [ ] Add `loading.tsx` (or skeletons) to avoid layout shift and blank first paint.

---

## 8. Best Practices

This section is a **best-practices audit** for Next.js, React, TypeScript, accessibility, security, SEO, and code style.

### 8.1 Next.js App Router

| Practice | Status | Action |
|----------|--------|--------|
| Server components by default | ✅ | Keep; add `'use client'` only where needed (state, effects, browser APIs). |
| Metadata (title, description, OG) | ✅ | Used in page/layout; ensure all routes export metadata (e.g. recitations listing and detail). |
| Loading and error UI | ❌ | Add `loading.tsx` and `error.tsx` at route segments that fetch data. |
| Middleware lightweight | ✅ | Only sets headers; keep it that way. |
| Static params where possible | ✅ | `generateStaticParams` for `[tenant]`; consider for `[tenant]/recitations/[recitationId]` if IDs are known at build time. |

### 8.2 React

| Practice | Status | Action |
|----------|--------|--------|
| Server-first | ✅ | Templates and most sections are server components. |
| Client boundary minimal | ✅ | TenantProvider, ThemeProvider, Header, RecitationsPlayer, Carousel, and sections that need state are client. |
| No prop drilling where context fits | ✅ | TenantProvider provides tenant; ThemeProvider receives branding. |
| Keys stable and unique | ✅ | Lists use `mushaf.id`, `recitation.id`, etc. |
| Avoid inline object/array creation in render | ⚠️ | Audit; pass stable references where it matters for child re-renders. |

### 8.3 TypeScript

| Practice | Status | Action |
|----------|--------|--------|
| Strict mode | ✅ | tsconfig has `"strict": true`. |
| No `any` in app code | ⚠️ | Grep for `any`; replace with proper types (e.g. Button asChild cloneElement). |
| Shared types for API | ❌ | Add `types/api.ts` (or similar) for recitations, reciters, tracks DTOs; use in lib and components. |
| React.CSSProperties import | ⚠️ | Use `import type { CSSProperties } from 'react'` in theme.ts. |

### 8.4 Accessibility (a11y)

| Practice | Status | Action |
|----------|--------|--------|
| Semantic HTML | ⚠️ | Use `<section>`, `<article>`, `<nav>` where appropriate; avoid div soup. |
| Heading order | ✅ | Single h1 per page; sections use h2/h3. |
| Focus visible | ⚠️ | Ensure all interactive elements have visible focus ring (e.g. `focus:ring-2 focus:ring-primary`). |
| ARIA labels | ✅ | Buttons and links have aria-label where needed (e.g. “Toggle menu”, “Previous slide”). |
| Live regions | ❌ | RecitationsPlayer and Carousel state changes (e.g. selected track, playing) should use `aria-live` for screen readers. |
| Alt text | ⚠️ | All meaningful images must have descriptive `alt`; decorative images `alt=""`. |
| Color contrast | ⚠️ | Verify contrast for primary/secondary and gray text (e.g. #6a6a6a on white). |
| Keyboard navigation | ✅ | Links and buttons are focusable; ensure no trap in mobile menu (focus trap on open, restore on close). |

### 8.5 Security

| Practice | Status | Action |
|----------|--------|--------|
| Security headers | ❌ | Add CSP, X-Frame-Options, X-Content-Type-Options in next.config; start with report-only CSP if needed. |
| Input validation | ⚠️ | Validate `[tenant]` and `[recitationId]` (e.g. allowlist tenant IDs, numeric or slug for recitationId) before passing to API. |
| No secrets in client | ✅ | API URL is public; no API keys in client code. |
| Rate limiting | ❌ | Optional: add rate limiting in middleware for API routes or sensitive paths. |

### 8.6 SEO

| Practice | Status | Action |
|----------|--------|--------|
| Metadata per route | ⚠️ | Root and [tenant] have metadata; add for recitations listing and detail (title, description, OG). |
| Sitemap | ❌ | Add `app/sitemap.ts` with tenant and recitation URLs. |
| Robots | ❌ | Add `app/robots.ts` or static `public/robots.txt`. |
| Semantic markup | ⚠️ | Use `<main>`, `<nav>`, `<footer>`, `<section>`; consider JSON-LD for audio content on recitation detail. |
| Canonical / hreflang | ❌ | If multiple locales or tenants share content, add canonical and hreflang later. |

### 8.7 RTL and i18n

| Practice | Status | Action |
|----------|--------|--------|
| Logical CSS (start/end, ms/me) | ⚠️ | Carousel and ReciterCard (and any remaining) should use logical properties; audit for `left`/`right`. |
| dir and lang on root | ✅ | `lang="ar" dir="rtl"` on `<html>`. |
| Centralized copy | ❌ | Arabic/English strings are scattered; consider constants or i18n keys for consistency and future LTR/locale. |

### 8.8 Code Style and Maintainability

| Practice | Status | Action |
|----------|--------|--------|
| No console in production | ❌ | Replace with logger (e.g. `lib/logger.ts`) that no-ops or filters by level in production. |
| Constants for magic numbers | ❌ | Centralize `REVALIDATE_SECONDS`, `FETCH_TIMEOUT_MS`, `PAGE_SIZE`, etc. |
| Error handling strategy | ❌ | Document: when to throw, when to return null, when to show UI; use consistent pattern in data fetchers. |
| ESLint rules | ⚠️ | Consider rules for `'use client'` usage, image `alt`/`sizes`, and no console in production. |

### 8.9 Best-Practices Checklist (Summary)

- [ ] Add `loading.tsx` and `error.tsx` for key route segments.
- [ ] Export metadata (title, description, OG) for recitations listing and detail.
- [ ] Add `types/api.ts` and use it in lib; fix `any` and theme.ts `CSSProperties` import.
- [ ] Semantic HTML: use `<section>`, `<nav>`, `<main>`, `<footer>` where appropriate.
- [ ] Focus ring on all interactive elements; `aria-live` for player/carousel state.
- [ ] Validate tenant ID and recitation ID before API calls; add security headers (CSP, etc.).
- [ ] Sitemap and robots; JSON-LD for recitation detail if desired.
- [ ] Logical CSS audit; centralized copy or i18n.
- [ ] Logger instead of console; centralize constants; document error strategy.

---

## 9. Plan to Achieve Perfection

### Phase 1: Critical Fixes (1–2 days)

1. **Backend URL**
   - In `lib/utils.ts`, restore and use `NEXT_PUBLIC_API_URL` (and optional env-based defaults). Document in env.example.
2. **Logging**
   - Introduce a tiny logger (e.g. `lib/logger.ts`) that no-ops or filters by level in production. Replace all `console.*` in lib and app with the logger; remove or gate debug logs in AudioPlayer and recitation pages.
3. **Not-found page**
   - Make it tenant-aware: use default tenant id for “Home” link (e.g. `/${defaultTenantId}`), and optionally show tenant name/logo if available (e.g. from header or context).
4. **Hardcoded tenant paths**
   - HeroSection: accept optional `tenantId` (or get from TenantProvider) and build “تصفح القراء” / “استمع الان” with `/${tenantId}/...`.
   - SaudiCenterTemplate: set FeaturedRecitationsSection `viewAllHref` to `/${tenant.id}/recitations` (not `/saudi-center/recitations`).

### Phase 2: Consistency & Correctness (1–2 days)

5. **Recitation detail “other mushafs”**
   - Fetch list of recitations (e.g. same as listing) and filter out current recitation; or add a small API/config for “related” mushafs. Remove hardcoded `otherMushafs` array.
6. **Reciters API**
   - Align with backend (trailing slash or not); document in a small “API contract” section in README or ARCHITECTURE.
7. **RTL / logical properties**
   - Carousel: use `end-4` / `start-4` (or equivalent). ReciterCard: use logical inset. Audit other components for `left`/`right` and replace with logical or RTL-safe utilities.
8. **Theme type**
   - In `lib/theme.ts`, use `import type { CSSProperties } from 'react'` and return `CSSProperties` from `getThemeStyles`.

### Phase 3: SSR & SEO (1–2 days)

9. **SSR**
   - Document SSR strategy in ARCHITECTURE: which routes are server-rendered, where client boundaries are and why. Ensure no critical crawlable text is client-only (current setup is OK).
   - Optional: add `Suspense` for slow data (e.g. recitation tracks) to stream HTML; optional `generateStaticParams` for recitation detail (top N IDs per tenant).
10. **Metadata**
    - Add `generateMetadata` to `app/[tenant]/recitations/page.tsx`: title (e.g. “المصاحف المسجلة | {tenant.name}”), description, openGraph, using tenant config.
    - Add `generateMetadata` to `app/[tenant]/recitations/[recitationId]/page.tsx`: title (e.g. “{recitation.name} | {reciterName}”), description, openGraph (image from reciter or tenant), using recitation/reciter data.
11. **Sitemap and robots**
    - Implement `app/sitemap.ts`: use `getAllTenantIds()` and optionally recitation IDs; output `url` entries with `lastModified`, `changeFrequency`, `priority`; base URL from env or request.
    - Implement `app/robots.ts` (or `public/robots.txt`): allow crawlers, reference sitemap URL.
12. **Structured data (JSON-LD)**
    - Tenant home (or layout): add JSON-LD `Organization` (name, url, logo from tenant).
    - Recitation detail: add `AudioObject` or `MusicRecording` (name, description, performer, duration, contentUrl) for the recitation/first track.
13. **Semantic HTML**
    - Use `<main>`, `<nav>`, `<footer>`, `<section>` with headings; ensure one `<h1>` per page and correct heading order. Add to SSR & SEO checklist.

### Phase 4: Documentation & Types (1 day)

14. **Docs**
   - Update README, STRUCTURE, and DOCS_INDEX to describe:
     - Routes: `/`, `/[tenant]`, `/[tenant]/recitations`, `/[tenant]/recitations/[recitationId]`.
     - Templates: default, magazine, saudi-center (and minimal alias).
     - Data: tenants.json, backend API, and which endpoints are used.
   - Update VISUAL_GUIDE/ARCHITECTURE if they show old single-page flow.
10. **Minimal template**
    - Either add a real “minimal” template (e.g. Hero + Footer only) and document it, or remove `'minimal'` from TemplateType and registry (map to default only in docs).
11. **API types**
    - Add `types/api.ts` (or similar) with interfaces for recitations, reciters, tracks API responses; use them in lib and optionally add Zod (or similar) for validation.

### Phase 4: Testing (2–3 days)

12. **Unit tests**
    - Jest or Vitest: tenant-resolver (strategies, getTenantFromHeaders), tenant-config (load, validate, cache), theme (generateThemeVariables, getFontLink), utils (getBackendUrl, cn). Mock fetch for API-based code.
18. **Integration tests**
    - Test page rendering for `/`, `/[tenant]`, `/[tenant]/recitations` with mocked tenant config and API; assert key sections and links.
19. **E2E**
    - Playwright (or Cypress): visit default tenant home, navigate to recitations, open a recitation, press play; assert no console errors and critical elements visible.
20. **CI**
    - Add `npm run test` (and `test:ci` if needed). Run lint + typecheck + tests on PR.

### Phase 6: Performance (1–2 days)

21. **Core Web Vitals**
    - Run Lighthouse on `/`, `/[tenant]`, `/[tenant]/recitations`; record LCP, INP, CLS. Set targets (LCP &lt; 2.5s, CLS &lt; 0.1).
22. **Images**
    - Hero: ensure `next/image` with `priority` and `sizes` on all templates. Replace `<img>` in PartnersSection (and elsewhere) with `next/image`; add `sizes` to cards/avatars.
23. **Fonts**
    - Unify font loading: for RTL/Arabic tenants, avoid injecting duplicate tenant font `<link>` when root already uses `next/font` (IBM Plex Sans Arabic). Option: only inject tenant font when different from root, or use `next/font` for all.
24. **JS bundle**
    - Lazy-load below-the-fold client components: use `next/dynamic` with `ssr: false` for RecitationsPlayer and Carousel where they are not above the fold (e.g. player on detail page on mobile).
25. **Loading and list size**
    - Add `loading.tsx` (or skeletons) at app, [tenant], and recitations segments to avoid layout shift. For recitations list, add pagination or virtualization if list grows (e.g. &gt; 50 items).
26. **Caching**
    - Document or centralize `revalidate` (e.g. `lib/constants.ts`: REVALIDATE_LISTING, REVALIDATE_DETAIL); consider per-route values.

### Phase 7: Best Practices (1–2 days)

27. **Next.js and React**
    - Add `loading.tsx` and `error.tsx` for app, [tenant], recitations, and recitation detail. Ensure all routes export metadata (recitations listing and detail).
28. **TypeScript and types**
    - Add `types/api.ts` for recitations, reciters, tracks API DTOs; use in lib. Fix `any` (e.g. Button asChild); use `import type { CSSProperties } from 'react'` in theme.ts.
29. **Accessibility**
    - Semantic HTML: use `<section>`, `<nav>`, `<main>`, `<footer>` where appropriate. Focus ring on all interactive elements; add `aria-live` for RecitationsPlayer and Carousel state changes. Verify alt text and contrast.
30. **Security**
    - Validate `[tenant]` and `[recitationId]` (allowlist or regex) before passing to API. Add security headers in next.config (CSP, X-Frame-Options, X-Content-Type-Options); start with report-only CSP if needed.
31. **SEO**
    - Sitemap and robots (Phase 3). JSON-LD for recitation detail (Phase 3). Canonical URLs if duplicate paths exist.
32. **Code style**
    - Logger instead of console (Phase 1). Centralize constants (REVALIDATE_*, FETCH_TIMEOUT_MS, PAGE_SIZE). Document error-handling strategy in ARCHITECTURE or CONTRIBUTING.

### Phase 8: Resilience & UX (1–2 days)

33. **Error boundaries**
    - Add `app/error.tsx` and optionally `app/[tenant]/error.tsx` (and recitations) with tenant-aware messaging and retry.
34. **Loading** (if not done in Phase 6)
    - Ensure `app/loading.tsx`, `app/[tenant]/loading.tsx`, `app/[tenant]/recitations/loading.tsx` (and detail if desired) with skeletons or spinners.
35. **404 for recitation**
    - Detail page already calls `notFound()` when recitation is missing; ensure not-found UI is the one from Phase 1.

### Phase 9: Security Headers (1 day)

36. **Security headers**
    - In `next.config.ts`, add Content-Security-Policy (and others as needed) without breaking fonts or scripts; optionally add rate limiting in middleware for API or sensitive routes if applicable.
37. **Sitemap/robots** (if not done in Phase 3)
    - Ensure `app/sitemap.ts` and `app/robots.ts` are in place (see Phase 3).

### Phase 10: Polish (ongoing)

38. **Localization**
    - Default/FooterSection and AssetCategoriesSection/SpeakersSection: replace hardcoded English with tenant-driven or i18n keys for a consistent Arabic/English story.
39. **Feature flags**
    - Implement env-based flags for tenant resolution strategies (see env.example) and document behavior.
40. **Sponsors / Partners / About**
    - Move from hardcoded arrays to tenant content or config so they can be edited without code changes.
41. **RTL logical CSS**
    - Complete audit: Carousel, ReciterCard, and any remaining `left`/`right` → logical properties.
42. **Analytics**
    - If NEXT_PUBLIC_GA_ID or GTM is set, wire them in layout or provider and document in README.

---

## 10. File-by-File Notes

| File | Notes |
|------|------|
| **app/layout.tsx** | Root layout: IBM Plex Sans Arabic, `lang="ar" dir="rtl"`. Metadata is generic; could be overridden per-route. |
| **app/page.tsx** | Home: getTenantFromHeaders → loadTenantConfig → Template. Two console.logs; remove or use logger. |
| **app/not-found.tsx** | Not tenant-aware; fix as in Phase 1. |
| **app/globals.css** | Design tokens, RTL base, custom audio player styles. Good. |
| **app/[tenant]/page.tsx** | Tenant home; params.tenant → loadTenantConfig → Template. Two console.logs. |
| **app/[tenant]/recitations/page.tsx** | Listing; getRecordedMushafs(tenantId), PageLayout, RecitationsPageContent. No metadata export; add title/description. |
| **app/[tenant]/recitations/[recitationId]/page.tsx** | Detail: getRecitationById, getRecitationTracksByAssetId, RecitationsPlayer, hardcoded otherMushafs. Many console.*; remove or gate. Mock surahItems unused (commented flow uses API). |
| **middleware.ts** | Sets x-pathname, x-hostname. Matcher excludes _next, static, favicon, api, and paths with extensions. Good. |
| **lib/tenant-resolver.ts** | domain → subdomain → path. pathStrategy skips api, _next, static, favicon. Two console.logs. |
| **lib/tenant-config.ts** | In-memory cache, load from JSON, validate. getDefaultTenantId from env. Three console.*. |
| **lib/theme.ts** | generateThemeVariables, applyThemeVariables, getThemeStyles, getFontLink. Add React.CSSProperties import. |
| **lib/utils.ts** | cn(), getBackendUrl() — restore env logic. |
| **lib/placeholder-images.ts** | Used for generic tenants; via.placeholder.com. |
| **lib/recitation-tracks.ts** | getFeaturedRecitationTracks (mock), getRecitationTracksByAssetId (API). Heavy logging; use logger. |
| **lib/reciters.ts** | getReciters with fallback to mock. Six console.*. |
| **lib/recorded-mushafs.ts** | getRecordedMushafs, getRecitationById. Many console.*; normalize with logger. |
| **types/tenant.types.ts** | Complete; TemplateType includes 'saudi-center'. |
| **config/tenants.json** | default, publisher-1, publisher-2, saudi-center. saudi-center has Arabic content and template saudi-center. |
| **templates/index.ts** | Registry: default, magazine, minimal→default, saudi-center. |
| **templates/DefaultTemplate.tsx** | Hero, Statistics, AssetCategories, Speakers, Footer. |
| **templates/MagazineTemplate.tsx** | Same without Speakers. |
| **templates/SaudiCenterTemplate.tsx** | Async; fetches reciters, mushafs, featured tracks. PartnersSection, AboutSection, RecordedMushafsSection, FeaturedRecitationsSection, RecitersSection, SponsorsSection, StatisticsSection. Sponsors and aboutFeatures hardcoded. |
| **components/providers/TenantProvider.tsx** | Context for tenant; client. |
| **components/providers/ThemeProvider.tsx** | applyThemeVariables on mount; client. |
| **components/layout/PageLayout.tsx** | Header + main + Footer; navItems use tenant.id. |
| **components/layout/Header.tsx** | Logo, nav, CTA buttons, mobile menu. Logo src /logos/full-logo.png (not tenant.branding.logo). Consider tenant logo for non–Saudi Center. |
| **components/layout/Footer.tsx** | Two variants: saudi-center (custom layout) vs default. |
| **components/sections/HeroSection.tsx** | Two-column; statsCard; hardcoded /saudi-center links — pass tenantId. |
| **components/sections/AboutSection.tsx** | Title, description, feature cards. |
| **components/sections/RecordedMushafsSection.tsx** | Carousel of MushafCards; viewAllHref. |
| **components/sections/RecitationsPageContent.tsx** | Top section (search, filter) + listing; client. |
| **components/sections/RecitationsTopSection.tsx** | Search + riwaya filter + view toggle. |
| **components/sections/RecitationsListingSection.tsx** | Grid, load more, filter by search and riwaya. |
| **components/sections/FeaturedRecitationsSection.tsx** | RecitationsPlayer + “view all”. |
| **components/sections/RecitersSection.tsx** | Carousel of ReciterCards. |
| **components/sections/PartnersSection.tsx** | Horizontal logos; default list; uses <img>. |
| **components/sections/SponsorsSection.tsx** | Cards with logo and description. |
| **components/sections/StatisticsSection.tsx** | Dark green band; optional title/description; value + label + description. |
| **components/sections/AssetCategoriesSection.tsx** | English headings; tenant content for categories. |
| **components/sections/SpeakersSection.tsx** | English headings; client for audio. |
| **components/sections/FooterSection.tsx** | Default footer; English “Terms”/“Privacy”. |
| **components/ui/Button.tsx** | Variants, asChild, Play icon for primary. |
| **components/ui/Card.tsx** | Variants, hover. |
| **components/ui/Badge.tsx** | Tone, size, shape. |
| **components/ui/Carousel.tsx** | Embla, RTL; use logical positioning for arrows. |
| **components/ui/Icons.tsx** | Checkmark, Play, Twitter, Instagram, TikTok. |
| **components/audio/AudioPlayer.tsx** | List + player; two variants; many console.* — use logger. |
| **components/cards/MushafCard.tsx** | Link, image, badges. |
| **components/cards/ReciterCard.tsx** | Image, overlay card; use logical insets. |
| **next.config.ts** | reactStrictMode, images (dangerouslyAllowSVG, remotePatterns), DNS prefetch header. |
| **tailwind.config.ts** | Colors/font from CSS variables; content paths. |
| **tsconfig.json** | Strict; paths @/*. |
| **package.json** | No test script; Next 15, React 19, Tailwind, embla, react-icons, etc. |

---

## 11. Recommendations Summary

| Priority | Action |
|----------|--------|
| P0 | Use env for backend URL; remove or gate all production console.*. |
| P0 | Make not-found tenant-aware; fix hardcoded /saudi-center in Hero and FeaturedRecitations. |
| P1 | **SSR & SEO:** Add `generateMetadata` to recitations listing and detail; implement sitemap and robots; add JSON-LD (Organization, AudioObject); document SSR strategy in ARCHITECTURE. |
| P1 | Document [tenant] and recitations routes and templates; fix “other mushafs” source. |
| P1 | Add unit tests for resolver, config, theme, utils; add E2E for main flows. |
| P1 | **Performance:** Measure CWV; hero `priority`+`sizes`; replace `<img>` with `next/image`; unify fonts; lazy-load below-the-fold client components; add `loading.tsx`. |
| P1 | **Best practices:** Add `loading.tsx`/`error.tsx`; metadata for all routes; `types/api.ts`; validate tenant/recitation IDs; security headers; logger + constants. |
| P2 | Add error.tsx and loading.tsx; RTL/logical props in Carousel and ReciterCard; theme.ts import. |
| P2 | Sitemap, robots, optional CSP; i18n or tenant-driven copy for English strings. |
| P2 | **SSR & SEO:** Semantic HTML (`<main>`, `<nav>`, `<section>`); canonical URLs if duplicate paths; optional Suspense/streaming for slow data. |
| P2 | **Performance:** Pagination or virtualization for large recitations list; centralize revalidate/timeouts. |
| P2 | **Best practices:** Semantic HTML; focus and aria-live; ESLint for console/alt/use client. |
| P3 | Minimal template or remove; feature flags; sponsors/partners from config. |
| P3 | **SSR & SEO:** Optional `generateStaticParams` for recitation detail; BreadcrumbList JSON-LD. |
| P3 | **Performance:** Ongoing CWV monitoring; tune revalidate per route. |
| P3 | **Best practices:** Document error strategy; optional axe/Lighthouse a11y baseline. |

---

*End of review. Use this document as a living checklist; update it as items are completed or priorities change.*
