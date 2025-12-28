# Project Structure

```
landing-app/
│
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout component
│   ├── page.tsx                 # Main landing page (tenant-aware)
│   ├── not-found.tsx            # 404 error page
│   └── globals.css              # Global styles + CSS variables
│
├── components/                   # React components
│   ├── providers/               # Context providers
│   │   ├── TenantProvider.tsx   # Tenant context for components
│   │   └── ThemeProvider.tsx    # Theme application (client-side)
│   │
│   └── sections/                # Landing page sections
│       ├── HeroSection.tsx      # Hero banner with CTA
│       ├── StatisticsSection.tsx # Statistics/metrics display
│       ├── AssetCategoriesSection.tsx # Content categories grid
│       ├── SpeakersSection.tsx  # Speaker profiles with audio
│       └── FooterSection.tsx    # Footer with links & social
│
├── templates/                    # Page templates
│   ├── DefaultTemplate.tsx      # Full-featured template
│   ├── MagazineTemplate.tsx     # Editorial template
│   └── index.ts                 # Template registry
│
├── lib/                          # Utility functions
│   ├── tenant-resolver.ts       # Tenant identification logic
│   ├── tenant-config.ts         # Config loading & caching
│   ├── theme.ts                 # Theme generation utilities
│   └── placeholder-images.ts    # Image placeholder helpers
│
├── types/                        # TypeScript definitions
│   └── tenant.types.ts          # All type interfaces
│
├── config/                       # Configuration files
│   └── tenants.json             # Tenant configurations
│
├── middleware.ts                 # Next.js middleware (routing)
├── tailwind.config.ts           # Tailwind configuration
├── tsconfig.json                # TypeScript configuration
├── next.config.ts               # Next.js configuration
├── postcss.config.mjs           # PostCSS configuration
├── package.json                 # Dependencies
│
├── README.md                    # Main documentation
├── ARCHITECTURE.md              # Technical architecture docs
├── GETTING_STARTED.md           # Quick start guide
└── STRUCTURE.md                 # This file
```

## Key Files Explained

### `/app/page.tsx`
Main entry point. Resolves tenant, loads config, renders template.

### `/middleware.ts`
Intercepts all requests to extract tenant information.

### `/lib/tenant-resolver.ts`
Contains all tenant resolution strategies (subdomain, path, domain).

### `/lib/tenant-config.ts`
Loads tenant configurations with caching.

### `/lib/theme.ts`
Generates CSS variables from tenant branding.

### `/templates/*`
Different page layouts for different tenant types.

### `/components/sections/*`
Reusable section components used by templates.

### `/config/tenants.json`
All tenant configurations in one file (can be replaced with API/database).

### `/types/tenant.types.ts`
TypeScript interfaces ensuring type safety across the app.

## Data Flow

```
Request
  ↓
middleware.ts (add headers)
  ↓
app/page.tsx (resolve tenant)
  ↓
lib/tenant-config.ts (load config)
  ↓
templates/* (select template)
  ↓
components/sections/* (render sections)
  ↓
HTML Response
```

## Component Types

### Server Components (default)
- app/page.tsx
- templates/*
- Most sections/* (except SpeakersSection)

### Client Components ('use client')
- components/providers/*
- components/sections/SpeakersSection.tsx

## CSS Architecture

```
globals.css
  ├─ Tailwind base/components/utilities
  └─ CSS variable defaults

tenant branding (runtime)
  ├─ --color-primary
  ├─ --color-secondary
  └─ --font-primary

Tailwind config
  └─ Maps classes to CSS variables
      ├─ bg-primary → var(--color-primary)
      └─ text-secondary → var(--color-secondary)
```

## Extending the System

### Add a New Section
1. Create `components/sections/NewSection.tsx`
2. Define types in `types/tenant.types.ts`
3. Add to template in `templates/DefaultTemplate.tsx`
4. Add content to tenant config

### Add a New Template
1. Create `templates/NewTemplate.tsx`
2. Register in `templates/index.ts`
3. Set `"template": "newtemplate"` in tenant config

### Add a Tenant
1. Add config to `config/tenants.json`
2. No code changes needed!

## Important Patterns

### Type Safety
All data structures are typed via `types/tenant.types.ts`

### Runtime Theming
CSS variables allow theme changes without rebuilds

### Caching
In-memory Map cache for tenant configs

### Conditional Rendering
Sections render based on `features` flags in config

### SEO
Server-side rendering ensures all content is crawlable

