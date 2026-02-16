# Tahbeer (تحبير) Tenant — Full Implementation Plan

> **THE GOLDEN RULE: DO NOT IMPROVISE.**
> If something is not specified here, ASK the user. Do not make up content, colors, URLs, text, or any data.
> Every piece of content, every color, every asset must come from either this plan or the Figma design.

---

## Prerequisites (MUST have before starting)

1. **Figma MCP access** — You have the Figma MCP tool available. Use it to extract design context, screenshots, and variables.
2. **Additional domain(s)** for Tahbeer beyond `tahbeer.netlify.app` — **ASK the user** if not yet provided.

---

## Figma Design Reference

**Figma file key:** `u55ARH7jJKdxXefQTgxV8l`

### Page-Level Designs

| Page | Figma URL | Node ID |
|------|-----------|---------|
| Entire design (overview) | https://www.figma.com/design/u55ARH7jJKdxXefQTgxV8l/Ta7beer--Copy-?node-id=2391-2034 | `2391:2034` |
| Home page (full frame) | https://www.figma.com/design/u55ARH7jJKdxXefQTgxV8l/Ta7beer--Copy-?node-id=2391-13578&m=dev | `2391:13578` |
| Listing page | https://www.figma.com/design/u55ARH7jJKdxXefQTgxV8l/Ta7beer--Copy-?node-id=4021-315&m=dev | `4021:315` |
| Details page | https://www.figma.com/design/u55ARH7jJKdxXefQTgxV8l/Ta7beer--Copy-?node-id=4024-4022&m=dev | `4024:4022` |

### Section/Component Designs

| Section | Figma URL | Node ID | Notes |
|---------|-----------|---------|-------|
| Header / Navbar | https://www.figma.com/design/u55ARH7jJKdxXefQTgxV8l/Ta7beer--Copy-?node-id=6007-1852&m=dev | `6007:1852` | May differ from Saudi Center header |
| Hero | https://www.figma.com/design/u55ARH7jJKdxXefQTgxV8l/Ta7beer--Copy-?node-id=6007-1854&m=dev | `6007:1854` | Likely different layout than Saudi Center |
| About | https://www.figma.com/design/u55ARH7jJKdxXefQTgxV8l/Ta7beer--Copy-?node-id=6007-1855&m=dev | `6007:1855` | Compare with Saudi Center AboutSection |
| Readings | https://www.figma.com/design/u55ARH7jJKdxXefQTgxV8l/Ta7beer--Copy-?node-id=6007-1909&m=dev | `6007:1909` | Mushafs/recitations section |
| Project Idea | https://www.figma.com/design/u55ARH7jJKdxXefQTgxV8l/Ta7beer--Copy-?node-id=6007-1910&m=dev | `6007:1910` | **NEW section** — does NOT exist in Saudi Center |
| Review Members | https://www.figma.com/design/u55ARH7jJKdxXefQTgxV8l/Ta7beer--Copy-?node-id=6007-1911&m=dev | `6007:1911` | **NEW section** — may map to reciters or be entirely new |
| Footer | https://www.figma.com/design/u55ARH7jJKdxXefQTgxV8l/Ta7beer--Copy-?node-id=4024-853&m=dev | `4024:853` | Different from Saudi Center footer (no gov logos) |

### How to Use Figma MCP

To extract design context for any section, call the Figma MCP tool with:
- `fileKey`: `u55ARH7jJKdxXefQTgxV8l`
- `nodeId`: The node ID from the table above (e.g. `6007:1854` for the hero)

To get a screenshot:
- Use `get_screenshot` with the same fileKey and nodeId

To get design code/context:
- Use `get_design_context` with the same fileKey and nodeId

To get variable definitions (colors, etc.):
- Use `get_variable_defs` with the same fileKey and a relevant nodeId

**IMPORTANT:** Start Phase 3 by getting screenshots of ALL sections first to understand the full design before implementing anything.

### Key Design Notes from User

1. **Details page**: The details page design (`4024:4022`) is very similar to Saudi Center's. **DO NOT** create a new details page component — reuse the existing `app/[tenant]/recitations/[id]/page.tsx` as-is with the same UI and functionality.
2. **Listing page** (`4021:315`): Check in Figma whether it differs from Saudi Center's listing page. If similar, reuse; if different, create a variant.
3. **Project Idea** (`6007:1910`): This is a **brand new section** that doesn't exist in Saudi Center. You'll need to create a new component at `components/sections/ProjectIdeaSection.tsx`.
4. **Review Members** (`6007:1911`): This is a **brand new section** that doesn't exist in Saudi Center. You'll need to create a new component at `components/sections/ReviewMembersSection.tsx`. Check if it's related to the reciters concept or something entirely different.

### Tahbeer Template Section Order (from Figma home page)

The TahbeerTemplate sections, based on the Figma home page frame, should be in this order. **Verify this by getting a screenshot of node `2391:13578` (full home page):**

1. Header / Navbar
2. Hero
3. About
4. Readings (mushafs/recitations)
5. Project Idea (NEW)
6. Review Members (NEW)
7. Footer

**NOTE:** This order may not be exact. Verify from the Figma home page screenshot. There may be additional sections (statistics, partners, etc.) or some may be missing. Trust the Figma, not this guess.

---

## Architecture Context

This is a **Next.js 15 multi-tenant landing app** with:
- Tenant config in `config/tenants.json`
- Templates in `templates/` directory
- Tenant resolution via middleware (`middleware.ts`)
- CSS variable-based theming (`lib/theme.ts` → `ThemeProvider`)
- Types in `types/tenant.types.ts`
- Template registry in `templates/index.ts`

The first tenant (Saudi Center) is fully implemented. Tahbeer is the second tenant and currently has placeholder config pointing to the Saudi Center template.

**Key files you'll touch:**
- `config/tenants.json` — tenant configuration
- `types/tenant.types.ts` — TypeScript types
- `templates/index.ts` — template registry
- `templates/TahbeerTemplate.tsx` — NEW file (Tahbeer's own template)
- `components/layout/Header.tsx` — de-hardcode Saudi Center colors/logo
- `components/layout/Footer.tsx` — add Tahbeer footer variant
- `components/layout/PageLayout.tsx` — conditional GovernmentBanner
- `components/layout/GovernmentBanner.tsx` — no changes needed (just conditionally rendered)
- `components/sections/AboutSection.tsx` — de-hardcode icon bg color
- `app/page.tsx` — fix hardcoded Saudi Center metadata check
- `app/globals.css` — no changes needed (ThemeProvider overrides at runtime)

---

## Phase 1: Configuration & Infrastructure

### Step 1.1: Fix tenant name (تهبير → تحبير)

**File:** `config/tenants.json`

Find the tahbeer tenant block (starts around line 467). Make these exact replacements:

- `"name": "تهبير"` → `"name": "تحبير"`
- `"nameEn": "Tahbeer"` → `"nameEn": "Tahbeer"` (English name stays the same)
- In `seo.title`: `"تهبير - منصة التلاوات القرآنية"` → `"تحبير - منصة التلاوات القرآنية"` (will be replaced with real content from Figma later, but fix the typo now)
- In `seo.description`: replace `تهبير` with `تحبير` wherever it appears
- In `seo.keywords`: replace `"تهبير"` with `"تحبير"`
- In `content.hero.title`: replace `تهبير` with `تحبير`
- In `content.hero.description`: replace `تهبير` with `تحبير`
- In `content.footer.description`: replace `تهبير` with `تحبير`

**DO NOT** change the tenant `"id": "tahbeer"` — the ID stays in English and is used for routing.

### Step 1.2: Fix domain protocol

**File:** `config/tenants.json`, tahbeer block

Change:
```
"domain": "tahbeer.netlify.app"
```
To:
```
"domain": "https://tahbeer.netlify.app"
```

**Why:** The `getTenantDomain()` function in `lib/tenant-domain.ts` checks `tenant.domain.startsWith('http')`. Without the protocol, the domain resolution for X-Tenant headers will be incorrect.

### Step 1.3: Add additional domains

**File:** `config/tenants.json`, tahbeer block

After the `"domain"` field, add a `"domains"` array with whatever additional domains the user provides. Example structure:
```json
"domains": [
  "https://DOMAIN_FROM_USER"
],
```

**DO NOT** make up domains. Ask the user for the exact domains.

### Step 1.4: Change template to "tahbeer"

**File:** `config/tenants.json`, tahbeer block

Change:
```
"template": "saudi-center"
```
To:
```
"template": "tahbeer"
```

### Step 1.5: Add 'tahbeer' to the TemplateType union

**File:** `types/tenant.types.ts`

Find line ~210:
```typescript
export type TemplateType = 'default' | 'magazine' | 'minimal' | 'saudi-center';
```

Change to:
```typescript
export type TemplateType = 'default' | 'magazine' | 'minimal' | 'saudi-center' | 'tahbeer';
```

### Step 1.6: Register TahbeerTemplate in the template registry

**File:** `templates/index.ts`

Add the import at the top (after the SaudiCenterTemplate import):
```typescript
import { TahbeerTemplate } from './TahbeerTemplate';
```

Add to the TemplateRegistry object:
```typescript
export const TemplateRegistry = {
  default: DefaultTemplate,
  magazine: MagazineTemplate,
  minimal: DefaultTemplate,
  'saudi-center': SaudiCenterTemplate,
  'tahbeer': TahbeerTemplate,
} as const;
```

### Step 1.7: Add GovernmentBanner feature flag

**File:** `types/tenant.types.ts`

In the `TenantFeatures` interface (around line 63), add:
```typescript
export interface TenantFeatures {
  speakers: boolean;
  statistics: boolean;
  readings: boolean;
  media: boolean;
  newsletter: boolean;
  governmentBanner?: boolean;  // ADD THIS LINE
}
```

**File:** `config/tenants.json`

In the **saudi-center** tenant's `features` block, add:
```json
"governmentBanner": true
```

In the **tahbeer** tenant's `features` block, add:
```json
"governmentBanner": false
```

Also add `"governmentBanner": false` to the `default`, `publisher-1`, and `publisher-2` tenants' features blocks (they're not government sites either).

---

## Phase 2: Component Refactoring (De-hardcode Saudi Center specifics)

### Step 2.1: Refactor Header to use CSS variables and tenant logo

**File:** `components/layout/Header.tsx`

The Header currently hardcodes Saudi Center colors and logo. It needs to use CSS variables (which are set per-tenant by ThemeProvider).

**Changes needed:**

1. **Logo** (around line 82-88): The Header currently always shows `/logos/full-logo.svg` (Saudi Center). It receives a `logo` prop but doesn't use it for the full-width logo. 

   Find:
   ```tsx
   <Image
     src="/logos/full-logo.svg"
     alt={tenantName}
   ```
   
   But we need something smarter. The Header has a `logo` prop but uses a hardcoded SVG. We need a `logoFull` prop or similar. 
   
   **Approach:** Add a new optional prop `logoFull` to HeaderProps:
   ```typescript
   interface HeaderProps {
     logo: string;
     logoFull?: string;        // ADD THIS
     tenantName: string;
     navItems: Array<{ label: string; href: string }>;
     homeHref?: string;
   }
   ```
   
   Then change the Image src:
   ```tsx
   <Image
     src={logoFull || logo}
     alt={tenantName}
   ```

   **File:** `components/layout/PageLayout.tsx`
   
   Update the Header usage to pass `logoFull`:
   ```tsx
   <Header
     logo={tenant.branding.logo}
     logoFull={tenant.branding.logoFull || tenant.branding.logo}
     tenantName={tenant.name}
     navItems={navItems}
     homeHref={prefix || '/'}
   />
   ```

2. **Active nav item colors** (around lines 101-106): Replace hardcoded hex colors with CSS variables.

   Find all instances of these patterns in Header.tsx and replace:
   - `bg-[#193624]` → `bg-[var(--color-primary)]`
   - `hover:bg-[#193624]/10` → `hover:bg-[var(--color-primary)]/10`  
     **NOTE:** Tailwind can't do `/10` opacity on CSS variables with this syntax. Instead use: `hover:bg-primary/10` (if Tailwind config maps `primary` to the CSS variable) OR use inline style. Check `tailwind.config.ts` — if `primary` is mapped to `var(--color-primary)`, use `bg-primary` and `hover:bg-primary/10`.
   - `bg-[#54C08A]` → This is the active nav indicator color. It's a "success green" that may differ per tenant. For now, use `bg-[var(--color-secondary)]` or introduce a new CSS variable. **ASK the user** what color Tahbeer uses for the active indicator — or get it from Figma.
   - `text-[#161616]` → `text-[var(--color-text-default)]` (this one is fine as-is since it's a neutral, but using the variable is cleaner)

   **IMPORTANT:** After making these changes, verify Saudi Center still looks correct (the CSS variables default to Saudi Center colors in globals.css, and ThemeProvider sets them per-tenant).

3. **Mobile menu** (around lines 154-191): Same color replacements as above.

### Step 2.2: Refactor Footer for multi-tenant support

**File:** `components/layout/Footer.tsx`

The Footer currently checks `template === 'saudi-center'` (line 72) to render the custom footer. We need to handle Tahbeer separately.

**Approach:** Add a `tahbeer` template check that renders Tahbeer's own footer design. The structure will come from Figma.

For now, as a **skeleton** before Figma implementation:

After the Saudi Center footer block (after line 195 `}`), add:

```tsx
if (template === 'tahbeer') {
  return (
    <footer className="bg-[var(--color-primary)] text-white" dir="rtl">
      {/* TAHBEER FOOTER - TO BE IMPLEMENTED FROM FIGMA */}
      {/* DO NOT IMPROVISE - implement from Figma design only */}
      <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8 pt-10 pb-6">
        <p>Tahbeer footer placeholder — implement from Figma</p>
      </div>
    </footer>
  );
}
```

This will be replaced with the real Figma design in Phase 3.

**Key differences from Saudi Center footer (to implement from Figma):**
- NO Vision 2030 logo
- NO Saudi government full logo
- Different social links (from tenant config, not hardcoded)
- Different footer columns/layout (from Figma)
- Different background color (from Figma/tenant branding)

### Step 2.3: Make GovernmentBanner conditional

**File:** `components/layout/PageLayout.tsx`

The PageLayout always renders `<GovernmentBanner />`. We need to make it conditional based on the tenant's `features.governmentBanner` flag.

Find (around line 37-39):
```tsx
{showHeader && (
  <>
    <GovernmentBanner />
    <Header
```

Change to:
```tsx
{showHeader && (
  <>
    {tenant.features.governmentBanner && <GovernmentBanner />}
    <Header
```

### Step 2.4: De-hardcode AboutSection icon background

**File:** `components/sections/AboutSection.tsx`

Find (around line 44):
```tsx
<div className="w-12 h-12 rounded-lg bg-[#eef9f2] flex items-center justify-center">
```

Change to:
```tsx
<div className="w-12 h-12 rounded-lg bg-[var(--color-primary)]/10 flex items-center justify-center">
```

**NOTE:** If Tailwind can't handle `/10` with CSS variables, use this approach instead:
```tsx
<div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'color-mix(in srgb, var(--color-primary) 10%, white)' }}>
```

Or add a CSS variable like `--color-primary-bg` that each tenant defines. Check what works in the existing Tailwind setup.

**Alternative safe approach:** Add a new CSS variable in `app/globals.css`:
```css
--color-icon-bg: #eef9f2;
```
Then in `lib/theme.ts`, generate this variable per tenant as a light tint of primary. Use `bg-[var(--color-icon-bg)]` in the component.

### Step 2.5: Fix hardcoded Saudi Center metadata check

**File:** `app/page.tsx`

Find (around lines 41-44):
```typescript
const isSaudiCenter = tenantId === 'saudi-center';
const pageTitle = isSaudiCenter
  ? 'المركز السعودي للتلاوات القرآنية والأحاديث النبوية'
  : `${tenant.name} - Home`;
```

Change to use the SEO config or tenant name for all tenants:
```typescript
const pageTitle = tenant.seo?.title || tenant.name;
```

This way every tenant uses its own SEO title from config, no special-casing needed.

---

## Phase 3: Figma Design Implementation

> **CRITICAL: DO NOT make up any design details. Extract EVERYTHING from Figma.**
> Use the Figma MCP tools with file key `u55ARH7jJKdxXefQTgxV8l` and the node IDs listed in the Figma Design Reference section above.

### Step 3.0: Get full design overview (DO THIS FIRST)

Before implementing anything, get screenshots and design context for the ENTIRE home page to understand the full layout:

```
1. get_screenshot(fileKey: "u55ARH7jJKdxXefQTgxV8l", nodeId: "2391:13578")  — Full home page
2. get_screenshot(fileKey: "u55ARH7jJKdxXefQTgxV8l", nodeId: "4021:315")    — Listing page
3. get_screenshot(fileKey: "u55ARH7jJKdxXefQTgxV8l", nodeId: "4024:853")    — Footer
```

Study these screenshots to understand:
- The overall color scheme and visual style
- Section order on the home page
- How different it is from Saudi Center
- Whether the listing page needs changes or can be reused

### Step 3.1: Extract design tokens from Figma

Use `get_variable_defs` and `get_design_context` on the home page node (`2391:13578`) to extract:

1. **Color palette** → Update `config/tenants.json` tahbeer branding:
   - `primaryColor`: Extract the main brand color from Figma
   - `secondaryColor`: Extract the secondary brand color
   - `accentColor`: Extract the accent color
   - Note any additional colors used (for specific sections, backgrounds, etc.)

2. **Typography** → Check if it's the same font as Saudi Center (`IBM Plex Sans Arabic`) or different. If different, note the font family.

3. **Spacing/sizing** → Note any differences from the KSA Gov design system spacing already in use.

### Step 3.2: Export assets from Figma

For each asset, use Figma MCP to identify and then ask the user to export (or use Figma export if available):

| Asset | Where to find in Figma | Save to |
|-------|----------------------|---------|
| Logo (header) | Header node `6007:1852` | `/public/logos/tahbeer-full-logo.svg` |
| Logo (footer/dark bg) | Footer node `4024:853` | `/public/logos/tahbeer-full-logo-dark-bg.svg` |
| Logo (small/square) | Any logo instance | `/public/logos/tahbeer-logo.png` |
| Logo (full/wide) | Any full logo instance | `/public/logos/tahbeer-logo-full.png` |
| Favicon | Ask user or extract from logo | `/public/favicons/tahbeer.ico` (replace existing) |
| OG Image | Ask user or create from design | `/public/images/tahbeer/og-image.png` |
| Hero Image | Hero node `6007:1854` | `/public/images/tahbeer/hero-image.jpg` (if applicable) |
| Hero BG Pattern | Hero node `6007:1854` | `/public/images/tahbeer/hero-bg.svg` (if applicable) |
| Section-specific images | Various section nodes | `/public/images/tahbeer/` |

**DO NOT** use Saudi Center's assets for Tahbeer. Each tenant must have its own assets.
**If you can't export an asset via MCP, ASK the user to provide it.**

### Step 3.3: Implement each section from Figma

For EACH section, follow this process:
1. Get a screenshot: `get_screenshot(fileKey: "u55ARH7jJKdxXefQTgxV8l", nodeId: "NODE_ID")`
2. Get design context: `get_design_context(fileKey: "u55ARH7jJKdxXefQTgxV8l", nodeId: "NODE_ID")`
3. Compare with existing Saudi Center component
4. Decide: **Reuse**, **Variant**, or **New Component**

#### Section-by-section instructions:

**A) Header (node `6007:1852`)**

After Step 2.1 de-hardcoded the Header to use CSS variables, check the Figma to verify:
- Is the layout the same? (logo right, nav center, CTA left in RTL)
- Are the nav items the same or different?
- Is there a different background, border, or style?
- Any unique header elements (e.g., search bar, language toggle)?

If only colors differ → The CSS variable refactor from Phase 2 handles it automatically.
If layout differs → Create a variant prop on Header or a new `TahbeerHeader` component.

**Nav items for Tahbeer PageLayout** — Extract nav labels from the Figma header. Update `components/layout/PageLayout.tsx` to use different nav items for Tahbeer if needed. You may need to make nav items tenant-configurable or add a conditional:

```tsx
// In PageLayout.tsx, check tenant.template or tenant.id
const navItems = tenant.template === 'tahbeer'
  ? [/* nav items from Figma */]
  : [/* existing Saudi Center nav items */];
```

**B) Hero (node `6007:1854`)**

Get the design context and compare with `components/sections/HeroSection.tsx`.

- If layout is similar (text + optional image, CTA button) → Reuse with a `variant` prop
- If layout is very different → Create `components/sections/TahbeerHeroSection.tsx`

Extract from Figma:
- Hero title text → goes into `config/tenants.json` `content.hero.title`
- Hero description text → goes into `config/tenants.json` `content.hero.description`
- CTA button text → goes into `config/tenants.json` `content.hero.ctaText`
- Any hero image or background pattern
- Any statsCard equivalent or social links section

**C) About (node `6007:1855`)**

Get design context and compare with `components/sections/AboutSection.tsx`.

- If layout is similar (title + description + feature cards) → Reuse with different data
- If layout differs → Create `components/sections/TahbeerAboutSection.tsx`

Extract from Figma:
- About title text
- About description text
- Feature card items (title, description, icon for each)
- These go into the TahbeerTemplate as hardcoded data (same pattern as SaudiCenterTemplate `aboutFeatures` array)

**D) Readings (node `6007:1909`)**

Get design context and compare with `components/sections/RecordedMushafsSection.tsx` and `components/sections/FeaturedRecitationsSection.tsx`.

- This likely maps to the existing mushafs/recitations sections
- If cards look the same → Reuse existing components
- If card design differs → Create variant or new component

The data comes from the API (same endpoints, different tenant via X-Tenant header), so the data fetching stays the same.

**E) Project Idea (node `6007:1910`) — NEW SECTION**

This section does NOT exist in Saudi Center. You MUST create a new component.

1. Get screenshot and design context
2. Create `components/sections/ProjectIdeaSection.tsx`
3. Determine what data it needs (static text from config? dynamic from API?)
4. If the content is static text from the Figma, it can be:
   - Hardcoded in the TahbeerTemplate (like `aboutFeatures` in SaudiCenterTemplate), OR
   - Added to the tenant config if it should be configurable

```tsx
// components/sections/ProjectIdeaSection.tsx
// Structure based on Figma — implement the exact layout from the design
interface ProjectIdeaSectionProps {
  // Props based on what Figma shows
  title: string;
  description: string;
  // ... other props from Figma
}

export function ProjectIdeaSection({ title, description, ...props }: ProjectIdeaSectionProps) {
  return (
    <section className="...from Figma...">
      {/* Implement from Figma design context */}
    </section>
  );
}
```

**F) Review Members (node `6007:1911`) — NEW SECTION**

This section does NOT exist in Saudi Center. You MUST create a new component.

1. Get screenshot and design context
2. Create `components/sections/ReviewMembersSection.tsx`
3. Check if this is:
   - A static list of review board members (from config/hardcoded), OR
   - A dynamic list from the API (like reciters)
4. If it shows people with names/titles/photos, it might be similar to RecitersSection but with different data

```tsx
// components/sections/ReviewMembersSection.tsx
// Structure based on Figma — implement the exact layout from the design
```

**G) Footer (node `4024:853`)**

Get design context and implement in `components/layout/Footer.tsx`.

Replace the Phase 2 placeholder with the real Figma design:

1. Get screenshot: `get_screenshot(fileKey: "u55ARH7jJKdxXefQTgxV8l", nodeId: "4024:853")`
2. Get design context: `get_design_context(fileKey: "u55ARH7jJKdxXefQTgxV8l", nodeId: "4024:853")`
3. Implement the footer in the `if (template === 'tahbeer')` block in `Footer.tsx`

The Tahbeer footer will NOT have:
- Vision 2030 logo
- Saudi government full logo

It WILL have (extract from Figma):
- Tahbeer's own logo
- Footer layout/columns from Figma
- Social links from tenant config (`footer.social`)
- Contact info from tenant config (`footer.contact`)
- Copyright from tenant config (`footer.copyright`)
- Whatever else the Figma shows

**Use tenant config data** (not hardcoded text) for dynamic content:
```tsx
const footer = content.footer;
// Use footer.description, footer.links, footer.social, footer.copyright, footer.contact
```

### Step 3.4: Create TahbeerTemplate.tsx

**File:** `templates/TahbeerTemplate.tsx` (NEW FILE)

After implementing all individual sections, assemble them in the template.

Use `templates/SaudiCenterTemplate.tsx` as a **structural reference** for the data-fetching pattern, but the section composition must match the Figma home page.

```typescript
/**
 * Tahbeer Template
 * 
 * Home page template for Tahbeer (تحبير)
 * Implements the Figma design for the Tahbeer tenant
 */

import { TenantConfig } from '@/types/tenant.types';
import { PageLayout } from '@/components/layout/PageLayout';
// Import the sections you created/chose in Step 3.3
// The exact imports depend on which components you reused vs created new
import { getBackendUrl } from '@/lib/backend-url';
import { getRecordedMushafs } from '@/lib/recorded-mushafs';
import { getReciters } from '@/lib/reciters';
import { getFeaturedRecitationTracks } from '@/lib/recitation-tracks';
import { RecitationItem } from '@/components/audio/AudioPlayer';

interface TahbeerTemplateProps {
  tenant: TenantConfig;
  basePath?: string;
}

export async function TahbeerTemplate({ tenant, basePath = '' }: TahbeerTemplateProps) {
  const prefix = basePath || '';

  // Data fetching — same API pattern as SaudiCenterTemplate
  // The X-Tenant header is set automatically based on tenant.id
  const [reciters, mushafs] = await Promise.all([
    getReciters(tenant.id, prefix),
    getRecordedMushafs(tenant.id, {}, prefix),
  ]);

  const firstRecitationId = mushafs[0]?.id;
  const recitations: RecitationItem[] = firstRecitationId
    ? await getFeaturedRecitationTracks(tenant.id, 5, firstRecitationId)
    : [];

  // Static content for Tahbeer-specific sections (from Figma)
  // Example — replace with actual content from Figma:
  const aboutFeatures = [
    // { id: '1', title: 'FROM FIGMA', description: 'FROM FIGMA', iconSrc: '/icons/...' },
  ];

  return (
    <PageLayout tenant={tenant}>
      {/* 
        Section order from Figma home page (node 2391:13578).
        Verify and adjust based on the actual Figma screenshot.
        
        Expected order:
        1. Hero
        2. About
        3. Readings (mushafs/recitations)
        4. Project Idea (NEW)
        5. Review Members (NEW)
        
        But VERIFY from Figma — there may be more or fewer sections.
      */}
    </PageLayout>
  );
}
```

**IMPORTANT NOTES:**
- The data fetching for reciters/mushafs/recitations uses the SAME API endpoints as Saudi Center — the `tenant.id` passed to each function determines which tenant's data is returned via the X-Tenant header.
- Only include sections that appear in the Figma home page design.
- Section order MUST match Figma.
- Pass the correct props to each section based on Figma content.

### Step 3.5: Handle the Listing Page

**Figma node:** `4021:315`

Get a screenshot and compare with the existing listing page at `app/[tenant]/recitations/page.tsx`.

- If the listing page looks the same as Saudi Center → **Do nothing**. The existing page works for all tenants via tenant config and CSS variables.
- If the listing page has minor style differences → Add CSS variable overrides or a variant.
- If the listing page is very different → You may need tenant-specific conditional rendering in the page component. **But check first before creating anything new.**

### Step 3.6: Details Page — REUSE AS-IS

**Figma node:** `4024:4022`

**The user confirmed: The details page is the same as Saudi Center.**

**DO NOT** modify the details page (`app/[tenant]/recitations/[id]/page.tsx`).
**DO NOT** create a new details page component.

The existing details page already works for all tenants via:
- Tenant-aware data fetching (X-Tenant header)
- CSS variable theming (colors adapt automatically)

Just leave it alone.

---

## Phase 4: Content & Assets

### Step 4.1: Update tenant config with real content from Figma

**File:** `config/tenants.json`, tahbeer block

Extract ALL of the following from the Figma design and update:

```json
{
  "id": "tahbeer",
  "name": "تحبير",
  "nameEn": "Tahbeer",
  "domain": "https://tahbeer.netlify.app",
  "domains": ["FROM USER"],
  "api": {
    "development": "https://staging.api.cms.itqan.dev/tenant",
    "staging": "https://staging.api.cms.itqan.dev/tenant",
    "production": "https://api.cms.itqan.dev/tenant"
  },
  "template": "tahbeer",
  "branding": {
    "logo": "/logos/tahbeer-logo.png",
    "logoFull": "/logos/tahbeer-logo-full.png",
    "favicon": "/favicons/tahbeer.ico",
    "primaryColor": "FROM FIGMA",
    "secondaryColor": "FROM FIGMA",
    "accentColor": "FROM FIGMA",
    "font": "CHECK FIGMA - likely 'inter' or same as Saudi Center"
  },
  "seo": {
    "title": "FROM FIGMA",
    "description": "FROM FIGMA",
    "keywords": ["FROM FIGMA"],
    "ogImage": "/images/tahbeer/og-image.png",
    "twitterImage": "/images/tahbeer/twitter-image.png",
    "twitterCard": "summary_large_image"
  },
  "analytics": {
    "googleAnalyticsId": "ASK USER OR LEAVE PLACEHOLDER"
  },
  "features": {
    "speakers": true,
    "statistics": true,
    "readings": true,
    "media": true,
    "newsletter": false,
    "governmentBanner": false
  },
  "content": {
    "hero": {
      "title": "FROM FIGMA",
      "description": "FROM FIGMA",
      "image": "/images/tahbeer/hero-image.jpg",
      "ctaText": "FROM FIGMA",
      "ctaLink": "/recitations"
    },
    "statistics": [
      {
        "label": "FROM FIGMA",
        "value": "FROM FIGMA",
        "suffix": "",
        "description": "FROM FIGMA"
      }
    ],
    "footer": {
      "description": "FROM FIGMA",
      "tagline": "FROM FIGMA",
      "contact": {
        "email": "FROM FIGMA OR ASK USER",
        "phone": "FROM FIGMA OR ASK USER"
      },
      "links": "FROM FIGMA",
      "social": "FROM FIGMA OR ASK USER",
      "copyright": "FROM FIGMA"
    }
  },
  "cmsLinks": {
    "store": "ASK USER",
    "admin": "ASK USER",
    "support": "ASK USER"
  }
}
```

**Reminder:** Every `"FROM FIGMA"` must be replaced with actual content extracted from the Figma design. Every `"ASK USER"` must be confirmed with the user.

### Step 4.2: Update logo references for Header/Footer

If the Figma shows Tahbeer using SVG logos (like Saudi Center uses `full-logo.svg` / `full-logo-dark-bg.svg`), ensure:
- The SVG files are exported from Figma
- The Header renders the correct logo (should work automatically after Step 2.1 since it uses `logoFull` from config)
- The Footer renders the correct logo for Tahbeer (from Figma design)

### Step 4.3: Delete placeholder files

After adding real assets, delete:
- `/public/images/tahbeer/og-image-PLACEHOLDER.txt`

---

## Phase 5: Testing & Verification

### Step 5.1: Test path-based routing (localhost)

Start the dev server and verify:
- `http://localhost:3000/tahbeer` → Shows Tahbeer home page with correct template
- `http://localhost:3000/tahbeer/recitations` → Shows recitations page
- `http://localhost:3000/tahbeer/recitations/[any-id]` → Shows detail page
- `http://localhost:3000/tahbeer/hadiths` → Shows hadiths page (if applicable)
- `http://localhost:3000/saudi-center` → Still shows Saudi Center correctly (regression test)

### Step 5.2: Verify tenant isolation

Check that:
- Tahbeer pages show Tahbeer branding (logo, colors)
- Saudi Center pages still show Saudi Center branding
- GovernmentBanner does NOT appear on Tahbeer pages
- GovernmentBanner DOES appear on Saudi Center pages
- Footer is different for each tenant
- Header uses correct logo and colors for each tenant

### Step 5.3: Verify API integration

Check browser dev tools Network tab:
- API calls from Tahbeer pages should include `X-Tenant` header with Tahbeer's domain
- Reciters, mushafs, recitations should load correctly for Tahbeer

### Step 5.4: Visual comparison with Figma

Open the Figma design side-by-side with the implementation and verify:
- Colors match
- Typography matches
- Spacing matches
- Layout matches
- All content is correct (no placeholders remaining)
- All assets are displaying correctly

### Step 5.5: Check for remaining placeholders

Search the codebase for any remaining `[PLACEHOLDER]` text:
```bash
grep -r "PLACEHOLDER" config/tenants.json
```

There should be ZERO results for the tahbeer tenant.

---

## File Change Summary

| File | Action | Phase |
|------|--------|-------|
| `config/tenants.json` | Edit: fix name, domain, template, governmentBanner flag, all content | 1, 4 |
| `types/tenant.types.ts` | Edit: add `'tahbeer'` to TemplateType, add `governmentBanner` flag | 1 |
| `templates/index.ts` | Edit: import and register TahbeerTemplate | 1 |
| `templates/TahbeerTemplate.tsx` | **CREATE NEW**: main Tahbeer home page template | 3 |
| `components/layout/Header.tsx` | Edit: replace hardcoded colors with CSS vars, add `logoFull` prop | 2 |
| `components/layout/PageLayout.tsx` | Edit: pass `logoFull`, conditional GovernmentBanner, tenant-aware nav items | 2, 3 |
| `components/layout/Footer.tsx` | Edit: add `tahbeer` template footer from Figma | 2, 3 |
| `components/sections/AboutSection.tsx` | Edit: de-hardcode `#eef9f2` icon bg | 2 |
| `components/sections/ProjectIdeaSection.tsx` | **CREATE NEW**: from Figma node `6007:1910` | 3 |
| `components/sections/ReviewMembersSection.tsx` | **CREATE NEW**: from Figma node `6007:1911` | 3 |
| `app/page.tsx` | Edit: remove `isSaudiCenter` special case | 2 |
| `app/[tenant]/recitations/[id]/page.tsx` | **NO CHANGES** — reuse as-is for details page | — |
| `public/logos/tahbeer-*` | **CREATE**: export from Figma | 3 |
| `public/images/tahbeer/*` | **CREATE**: export from Figma | 3 |
| `public/favicons/tahbeer.ico` | **REPLACE**: with real favicon from Figma | 3 |
| Additional section components | **MAYBE CREATE**: if Figma shows sections with different layout than Saudi Center | 3 |

---

## Checklist Before Marking Complete

### Configuration
- [ ] Tenant name is "تحبير" (not "تهبير") everywhere in `tenants.json`
- [ ] Tenant `id` is still `"tahbeer"` (English, unchanged)
- [ ] Domain has `https://` protocol (`https://tahbeer.netlify.app`)
- [ ] Additional domains are configured (from user)
- [ ] Template is `"tahbeer"` (not `"saudi-center"`)
- [ ] `governmentBanner: false` in Tahbeer features
- [ ] `governmentBanner: true` in Saudi Center features

### Infrastructure
- [ ] `'tahbeer'` added to `TemplateType` union in `types/tenant.types.ts`
- [ ] `TahbeerTemplate` imported and registered in `templates/index.ts`
- [ ] `governmentBanner?: boolean` added to `TenantFeatures` interface

### Component De-hardcoding (Phase 2)
- [ ] Header uses CSS variables, not hardcoded `#193624` / `#54C08A`
- [ ] Header shows tenant-specific logo via `logoFull` prop
- [ ] Footer has Tahbeer-specific design (no Vision 2030, no gov logos)
- [ ] GovernmentBanner only shows for tenants with `governmentBanner: true`
- [ ] AboutSection icon bg uses CSS variable, not hardcoded `#eef9f2`
- [ ] `app/page.tsx` uses `tenant.seo?.title || tenant.name` (no Saudi Center special case)

### Figma Implementation (Phase 3)
- [ ] All section screenshots reviewed from Figma before coding
- [ ] Hero section matches Figma node `6007:1854`
- [ ] About section matches Figma node `6007:1855`
- [ ] Readings section matches Figma node `6007:1909`
- [ ] **ProjectIdeaSection** created from Figma node `6007:1910`
- [ ] **ReviewMembersSection** created from Figma node `6007:1911`
- [ ] Footer matches Figma node `4024:853`
- [ ] Header matches Figma node `6007:1852`
- [ ] Listing page checked against Figma node `4021:315`
- [ ] Details page left untouched (reuse Saudi Center's)
- [ ] TahbeerTemplate.tsx assembles all sections in correct Figma order

### Content & Assets (Phase 4)
- [ ] All branding colors from Figma in `tenants.json`
- [ ] All placeholder content replaced with real Figma content
- [ ] No `[PLACEHOLDER]` text remains in tahbeer config
- [ ] Logo files exist at referenced paths
- [ ] Hero image/background exported from Figma
- [ ] OG image created/exported
- [ ] Placeholder text file deleted (`og-image-PLACEHOLDER.txt`)

### Testing (Phase 5)
- [ ] `localhost:3000/tahbeer` shows Tahbeer home page
- [ ] `localhost:3000/tahbeer/recitations` shows listing page
- [ ] `localhost:3000/tahbeer/recitations/[id]` shows detail page
- [ ] `localhost:3000/saudi-center` still works (no regressions)
- [ ] GovernmentBanner absent on Tahbeer, present on Saudi Center
- [ ] API calls include correct X-Tenant header for Tahbeer
- [ ] Visual match with Figma verified for all sections

---

## Reminders for the Implementing Model

### The Golden Rules
1. **DO NOT IMPROVISE** — If you don't know a value (color, text, URL, layout), ASK the user. Never make up content.
2. **Figma is the source of truth** — Every visual decision (colors, spacing, layout, text content) comes from Figma. Use the MCP tools.
3. **Saudi Center must still work** — Every change to shared components MUST be backward compatible. Test both tenants.

### Technical Rules
4. **Read before editing** — Always read a file before modifying it.
5. **Read `.cursor/rules/project.mdc` first** — It contains mandatory project rules. Follow them.
6. **RTL is default** — "Start" = right, "End" = left. Use logical properties (`ms-`, `me-`, `ps-`, `pe-`, `start`, `end`), NOT `left`/`right`.
7. **CSS variables for theming** — Colors should use `var(--color-*)` not hardcoded hex values. ThemeProvider sets them per tenant.
8. **Server components by default** — Only use `'use client'` when interactivity is needed.
9. **Use `next/image`** for images with proper `alt`, `sizes`, and `priority` for above-the-fold content.
10. **Semantic HTML** — Use correct heading order, ARIA labels, meaningful alt text.

### Figma MCP Usage
11. **Always get a screenshot first** before implementing a section — so you understand what you're building.
12. **Then get design context** — for the code/layout details, colors, spacing.
13. **Use `get_variable_defs`** — to extract exact color values rather than guessing from screenshots.
14. **File key is always** `u55ARH7jJKdxXefQTgxV8l` — you don't need to ask for it.
15. **Node IDs are in the table above** — reference the "Figma Design Reference" section.

### Workflow
16. **Phase 1 first, then Phase 2, then Phase 3** — don't skip ahead. Phase 1 sets up infrastructure that Phase 3 depends on.
17. **Within Phase 3, get ALL screenshots first (Step 3.0)** — understand the full design before implementing any section.
18. **Implement sections one at a time** — don't try to build the entire template in one go.
19. **After each section, check for linter errors** — fix them before moving on.
20. **After Phase 2, test Saudi Center still works** — before starting Phase 3.
