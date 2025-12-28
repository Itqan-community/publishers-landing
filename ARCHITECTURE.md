# Architecture Documentation

## Table of Contents
1. [System Overview](#system-overview)
2. [Multi-Tenant Resolution](#multi-tenant-resolution)
3. [Theme System](#theme-system)
4. [Template System](#template-system)
5. [Data Flow](#data-flow)
6. [Component Architecture](#component-architecture)
7. [Performance Considerations](#performance-considerations)
8. [Scalability](#scalability)

---

## System Overview

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Client Request                        │
│              (subdomain/path/custom domain)              │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                  Next.js Middleware                      │
│         • Extracts hostname & pathname                   │
│         • Adds to request headers                        │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                  Tenant Resolver                         │
│         • Tries subdomain strategy                       │
│         • Tries path-based strategy                      │
│         • Tries custom domain mapping                    │
│         • Returns tenant ID or 'default'                 │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│               Tenant Config Loader                       │
│         • Checks in-memory cache                         │
│         • Loads from JSON/API                            │
│         • Validates configuration                        │
│         • Returns TenantConfig object                    │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                  Theme Provider                          │
│         • Generates CSS variables                        │
│         • Applies branding colors                        │
│         • Loads custom fonts                             │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                Template Renderer                         │
│         • Selects template based on config               │
│         • Renders sections conditionally                 │
│         • Passes tenant content to components            │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                   Final HTML                             │
│         • SEO optimized                                  │
│         • Server-side rendered                           │
│         • Themed with CSS variables                      │
└─────────────────────────────────────────────────────────┘
```

---

## Multi-Tenant Resolution

### Resolution Strategies

The system supports three tenant resolution strategies, checked in order:

#### 1. Subdomain Strategy

**Pattern**: `tenant.domain.com`

```typescript
// Example: publisher-1.mysite.com → "publisher-1"
const subdomainStrategy = {
  resolve: (request) => {
    const parts = hostname.split('.');
    if (parts.length >= 3) {
      return parts[0]; // subdomain
    }
    return null;
  }
};
```

**Use Case**: Primary production method, each tenant gets a subdomain

#### 2. Path-Based Strategy

**Pattern**: `domain.com/tenant`

```typescript
// Example: mysite.com/publisher-1 → "publisher-1"
const pathStrategy = {
  resolve: (request) => {
    const match = pathname.match(/^\/([^\/]+)/);
    return match ? match[1] : null;
  }
};
```

**Use Case**: Development/testing, or when subdomains aren't feasible

#### 3. Custom Domain Strategy

**Pattern**: `customdomain.com` → mapped tenant

```typescript
// Example: academicpress.org → "publisher-1"
const domainMap = {
  'academicpress.org': 'publisher-1',
  'globalmagazine.com': 'publisher-2'
};
```

**Use Case**: White-label deployments where tenants use their own domains

### Resolution Flow

```
┌──────────────┐
│   Request    │
└──────┬───────┘
       │
       ▼
┌────────────────────┐
│ Subdomain Strategy │──── Found? ──── Yes ───┐
└────────┬───────────┘                        │
         │ No                                 │
         ▼                                    │
┌────────────────────┐                        │
│  Path Strategy     │──── Found? ──── Yes ───┤
└────────┬───────────┘                        │
         │ No                                 │
         ▼                                    │
┌────────────────────┐                        │
│ Domain Strategy    │──── Found? ──── Yes ───┤
└────────┬───────────┘                        │
         │ No                                 │
         ▼                                    │
    ┌──────────┐                              │
    │ 'default'│                              │
    └────┬─────┘                              │
         │                                    │
         └────────────────────────────────────┤
                                              ▼
                                    ┌──────────────────┐
                                    │ Load Tenant Config│
                                    └──────────────────┘
```

---

## Theme System

### CSS Variable Approach

The theme system uses CSS custom properties for runtime theming without rebuilds.

#### Architecture

```
Tenant Config (JSON)
    │
    ├─ primaryColor: "#1a237e"
    ├─ secondaryColor: "#ffd600"
    └─ font: "roboto"
         │
         ▼
    Theme Generator
         │
         ├─ Generates lighter/darker shades
         ├─ Creates CSS variable object
         └─ Loads Google Font link
              │
              ▼
         Applied to :root
              │
              ├─ --color-primary: #1a237e
              ├─ --color-primary-dark: #131a5e
              ├─ --color-primary-light: #3949ab
              ├─ --color-secondary: #ffd600
              └─ --font-primary: 'Roboto', sans-serif
                   │
                   ▼
              Tailwind Classes
                   │
                   ├─ bg-primary → var(--color-primary)
                   ├─ text-secondary → var(--color-secondary)
                   └─ font-primary → var(--font-primary)
```

#### Color Generation

```typescript
// Automatic shade generation
primaryColor = "#1a237e"
  ↓
primaryDark = darken(primaryColor, 20%)   // #131a5e
primaryLight = lighten(primaryColor, 20%) // #3949ab
```

#### SSR + CSR Hybrid

```tsx
// Server-side: inline styles for immediate render
<div style={getThemeStyles(branding)}>
  
  // Client-side: React effect for dynamic updates
  <ThemeProvider branding={branding}>
    {children}
  </ThemeProvider>
</div>
```

This prevents flash of unstyled content (FOUC) while enabling client-side updates.

---

## Template System

### Template Registry Pattern

Templates are registered in a central registry for type-safe selection:

```typescript
const TemplateRegistry = {
  default: DefaultTemplate,
  magazine: MagazineTemplate,
  minimal: MinimalTemplate,
} as const;

// Type-safe getter
function getTemplate(type: TemplateType) {
  return TemplateRegistry[type] || TemplateRegistry.default;
}
```

### Template Composition

Templates are composed of reusable section components:

```
┌─────────────────────────────────────┐
│        Default Template              │
├─────────────────────────────────────┤
│  ┌───────────────────────────────┐  │
│  │     Hero Section              │  │
│  └───────────────────────────────┘  │
│  ┌───────────────────────────────┐  │
│  │     Statistics Section        │  │
│  └───────────────────────────────┘  │
│  ┌───────────────────────────────┐  │
│  │     Asset Categories Section  │  │
│  └───────────────────────────────┘  │
│  ┌───────────────────────────────┐  │
│  │     Speakers Section          │  │
│  └───────────────────────────────┘  │
│  ┌───────────────────────────────┐  │
│  │     Footer Section            │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│        Magazine Template             │
├─────────────────────────────────────┤
│  ┌───────────────────────────────┐  │
│  │     Hero Section              │  │
│  └───────────────────────────────┘  │
│  ┌───────────────────────────────┐  │
│  │     Statistics Section        │  │
│  └───────────────────────────────┘  │
│  ┌───────────────────────────────┐  │
│  │     Asset Categories Section  │  │
│  └───────────────────────────────┘  │
│  ┌───────────────────────────────┐  │
│  │     Footer Section            │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
```

### Conditional Rendering

Sections are rendered conditionally based on tenant features:

```typescript
{tenant.features.statistics && tenant.content.statistics?.length > 0 && (
  <StatisticsSection statistics={tenant.content.statistics} />
)}
```

---

## Data Flow

### Server-Side Rendering (SSR) Flow

```
1. Request arrives
   ↓
2. Middleware extracts tenant info
   ↓
3. Server component (page.tsx) runs:
   ├─ getTenantFromHeaders()
   ├─ loadTenantConfig(tenantId)
   └─ Returns TenantConfig
   ↓
4. Generate metadata (SEO)
   ↓
5. Render template with data
   ↓
6. HTML sent to client (fully rendered)
```

### Client-Side Hydration Flow

```
1. HTML arrives (already rendered)
   ↓
2. React hydrates components
   ↓
3. ThemeProvider useEffect runs
   ├─ Applies CSS variables to :root
   └─ Ensures theme matches SSR
   ↓
4. Interactive features activate
   ├─ Audio player controls
   ├─ Form submissions
   └─ Navigation
```

### Caching Strategy

```typescript
// In-memory cache
const configCache = new Map<string, TenantConfig>();

loadTenantConfig(tenantId) {
  if (configCache.has(tenantId)) {
    return configCache.get(tenantId); // Cache hit
  }
  
  const config = await fetchConfig(tenantId);
  configCache.set(tenantId, config);   // Cache miss → load & cache
  return config;
}
```

---

## Component Architecture

### Component Hierarchy

```
App (Server Component)
  │
  ├─ RootLayout
  │   └─ Global CSS
  │
  └─ HomePage (Server Component)
      │
      ├─ Tenant Resolution (server-side)
      ├─ Config Loading (server-side)
      │
      └─ TenantProvider (Client Component)
          │
          └─ ThemeProvider (Client Component)
              │
              └─ Template (Server Component)
                  │
                  ├─ HeroSection (Server Component)
                  ├─ StatisticsSection (Server Component)
                  ├─ AssetCategoriesSection (Server Component)
                  ├─ SpeakersSection (Client Component*)
                  └─ FooterSection (Server Component)

* Client component because it has interactive audio player
```

### Server vs Client Components

**Server Components** (default):
- HeroSection
- StatisticsSection
- AssetCategoriesSection
- FooterSection
- Templates

**Client Components** (`'use client'`):
- SpeakersSection (audio player interaction)
- ThemeProvider (useEffect for CSS variables)
- TenantProvider (React context)

### Props Flow

```typescript
// Type-safe props drilling
TenantConfig
  ↓
Template({ tenant })
  ↓
Section({ content: tenant.content.hero })
  ↓
Rendered UI
```

---

## Performance Considerations

### Optimization Strategies

#### 1. Server-First Architecture

```
Server Components (default)
  ├─ Zero client JS
  ├─ Fast initial load
  └─ SEO friendly
      ↓
Client Components (minimal)
  ├─ Only for interactivity
  ├─ Hydrate on demand
  └─ Lazy load when possible
```

#### 2. CSS Variables vs Runtime Styling

**Why CSS Variables?**

```typescript
// ❌ Bad: Re-render entire tree
<div style={{ color: tenant.primaryColor }}>

// ✅ Good: Update CSS variable only
:root { --color-primary: #123456; }
<div className="text-primary">
```

CSS variables change without React re-renders.

#### 3. Caching Layers

```
┌─────────────────────────────────────┐
│   Browser Cache (static assets)     │
│   • Images, fonts, CSS              │
│   • Cache-Control headers           │
└─────────────────┬───────────────────┘
                  │
┌─────────────────▼───────────────────┐
│   CDN Cache (Vercel/Netlify)        │
│   • Cached HTML pages               │
│   • Edge locations                  │
└─────────────────┬───────────────────┘
                  │
┌─────────────────▼───────────────────┐
│   In-Memory Cache (server)          │
│   • Tenant configs                  │
│   • Map<tenantId, config>           │
└─────────────────────────────────────┘
```

#### 4. Image Optimization

```tsx
// Next.js Image component
<Image
  src={hero.image}
  alt={hero.title}
  fill
  className="object-cover"
  priority          // Above-the-fold images
  sizes="100vw"     // Responsive sizing
/>
```

Auto-generates WebP, responsive sizes, lazy loading.

#### 5. Code Splitting

```
Templates loaded dynamically:
  default.js    → Only for 'default' tenants
  magazine.js   → Only for 'magazine' tenants
  minimal.js    → Only for 'minimal' tenants
```

---

## Scalability

### Horizontal Scaling

```
Load Balancer
  ├─ App Instance 1
  ├─ App Instance 2
  ├─ App Instance 3
  └─ App Instance N
      │
      └─ Shared Config Source
          ├─ API
          ├─ Database
          └─ CDN
```

Each app instance can resolve any tenant (stateless).

### Tenant Limits

Current architecture supports:
- **Small**: 1-50 tenants (JSON config)
- **Medium**: 50-500 tenants (API + cache)
- **Large**: 500+ tenants (Database + Redis cache)

### Database Evolution

```typescript
// Current: JSON file
import tenants from '@/config/tenants.json';

// Next: API endpoint
const config = await fetch(`/api/tenants/${id}`);

// Scale: Database query
const config = await db.tenants.findOne({ id });

// Enterprise: Cached database
const config = await redis.get(`tenant:${id}`) || 
               await db.tenants.findOne({ id });
```

### CDN Strategy

```
Static Assets (images, fonts)
  → CDN (CloudFront, Cloudflare)
  → Edge locations worldwide
  → Cache-Control: max-age=31536000

Dynamic HTML (tenant pages)
  → CDN with shorter TTL
  → Stale-while-revalidate
  → Cache-Control: s-maxage=60, stale-while-revalidate=300

API (tenant configs)
  → API route caching
  → Redis/in-memory cache
  → Invalidate on update
```

### Monitoring

Key metrics to track:

```typescript
// Performance
- Time to First Byte (TTFB)
- Largest Contentful Paint (LCP)
- First Input Delay (FID)
- Cumulative Layout Shift (CLS)

// Application
- Tenant resolution time
- Config load time
- Cache hit rate
- Error rate per tenant

// Business
- Active tenants
- Page views per tenant
- Conversion rates
- User engagement
```

---

## Security Considerations

### Input Validation

```typescript
// Tenant ID sanitization
function validateTenantId(id: string): boolean {
  return /^[a-z0-9-]+$/.test(id);  // Alphanumeric + hyphens only
}
```

### Content Security Policy

```typescript
// next.config.ts
headers: [
  {
    source: '/:path*',
    headers: [
      {
        key: 'Content-Security-Policy',
        value: "default-src 'self'; img-src 'self' https:; font-src 'self' https://fonts.gstatic.com;"
      }
    ]
  }
]
```

### Rate Limiting

```typescript
// Recommended: Add rate limiting middleware
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // 100 requests per IP
});
```

---

## Future Enhancements

### Phase 2: Database Integration

```typescript
// PostgreSQL schema
CREATE TABLE tenants (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  branding JSONB NOT NULL,
  features JSONB NOT NULL,
  content JSONB NOT NULL,
  cms_links JSONB NOT NULL,
  template VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_tenant_template ON tenants(template);
```

### Phase 3: Admin Panel

```
Admin Dashboard
  ├─ Tenant Management
  │   ├─ Create tenant
  │   ├─ Edit tenant
  │   └─ Delete tenant
  ├─ Template Editor
  │   ├─ Visual editor
  │   └─ Section management
  └─ Analytics
      ├─ Tenant metrics
      └─ Usage statistics
```

### Phase 4: Advanced Features

- Multi-language support (i18n)
- A/B testing framework
- Custom domain SSL automation
- Real-time preview
- Version control for configs
- Webhook integrations

---

## Conclusion

This architecture provides:

✅ **Scalability**: Handle 1 to 10,000+ tenants  
✅ **Performance**: Fast load times with SSR + caching  
✅ **Flexibility**: Template system for varied designs  
✅ **Maintainability**: Clean separation of concerns  
✅ **SEO**: Server-rendered, optimized metadata  
✅ **DX**: Type-safe, well-structured code  

The system is production-ready and can evolve from JSON configs to full database-backed multi-tenancy as needed.

