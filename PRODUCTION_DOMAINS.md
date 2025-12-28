# Production Domain Configuration Guide

## Overview

This guide explains how to configure custom domains and subdomains for your multi-tenant landing page platform in production.

---

## Tenant Resolution Strategies (Priority Order)

The system checks these strategies in order:

1. **Custom Domain** (e.g., `tenant1.com`)
2. **Subdomain** (e.g., `publisher-1.yourdomain.com`)
3. **Path-based** (e.g., `localhost:3000/publisher-1` - for local development only)

---

## Option 1: Custom Domains (tenant1.com, tenant2.com)

### Step 1: Configure Domain Mapping

Edit `lib/tenant-resolver.ts` and update the `domainMap` object:

```typescript
const domainMap: Record<string, string> = {
  'tenant1.com': 'publisher-1',
  'tenant2.com': 'publisher-2',
  'www.tenant1.com': 'publisher-1',
  'www.tenant2.com': 'publisher-2',
};
```

### Step 2: DNS Configuration

Each custom domain needs to point to your hosting provider:

**For Vercel:**
```
Type: A Record
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

**For Netlify:**
```
Type: A Record
Name: @
Value: 75.2.60.5

Type: CNAME
Name: www
Value: yourdomain.netlify.app
```

### Step 3: Add Domains in Hosting Dashboard

**Vercel:**
1. Go to Project Settings → Domains
2. Add `tenant1.com` and `www.tenant1.com`
3. Add `tenant2.com` and `www.tenant2.com`
4. Vercel will automatically handle SSL

**Netlify:**
1. Go to Domain Settings
2. Add custom domains
3. Netlify provisions SSL automatically

### Step 4: Test

```bash
# Will load publisher-1 tenant
https://tenant1.com

# Will load publisher-2 tenant
https://tenant2.com
```

---

## Option 2: Subdomains (publisher-1.yourdomain.com)

### Step 1: No Code Changes Needed

The subdomain strategy is already configured and works automatically!

### Step 2: DNS Configuration

Add wildcard or specific subdomain records:

**Wildcard (supports unlimited tenants):**
```
Type: CNAME
Name: *
Value: yourdomain.com
```

**Specific subdomains:**
```
Type: CNAME
Name: publisher-1
Value: yourdomain.com

Type: CNAME
Name: publisher-2
Value: yourdomain.com
```

### Step 3: Configure Wildcard SSL

**Vercel:**
- Go to Project Settings → Domains
- Add `*.yourdomain.com`
- Vercel handles wildcard SSL automatically

**Netlify:**
- Netlify supports wildcard domains in paid plans
- Add `*.yourdomain.com` in domain settings

### Step 4: Test

```bash
# Will load publisher-1 tenant
https://publisher-1.yourdomain.com

# Will load publisher-2 tenant
https://publisher-2.yourdomain.com

# Will load default tenant
https://yourdomain.com
```

---

## Option 3: Hybrid Approach (Recommended for Flexibility)

You can use **both strategies simultaneously**:

```typescript
// Custom domains for premium clients
const domainMap: Record<string, string> = {
  'premiumclient.com': 'publisher-1',
};

// Subdomains for regular clients
// publisher-2.yourdomain.com → automatically resolves to 'publisher-2'
```

### Resolution Order:
1. Check if `premiumclient.com` → maps to `publisher-1` ✅
2. Check if `publisher-2.yourdomain.com` → extracts `publisher-2` ✅
3. Check if `localhost:3000/publisher-1` → extracts `publisher-1` ✅ (dev only)

---

## Path-Based Strategy (Development Only)

The path-based strategy (`/publisher-1`) is **primarily for local development** and should not be used in production.

**Why?**
- SEO concerns (all tenants under one domain)
- Branding issues (tenants want their own domains)
- Analytics complexity

**When to use:**
- ✅ Local development without hosts file
- ✅ Testing without DNS setup
- ❌ Production deployments

To disable path-based in production, add environment check:

```typescript
// In lib/tenant-resolver.ts
export function resolveTenant(request: TenantRequest): string | null {
  const strategies = process.env.NODE_ENV === 'production' 
    ? [domainStrategy, subdomainStrategy]  // Production: no path-based
    : [domainStrategy, subdomainStrategy, pathStrategy];  // Dev: all strategies
  
  // ... rest of code
}
```

---

## Environment Variables (Optional)

For dynamic domain mapping (instead of hardcoding), use environment variables:

**Create `.env.local`:**
```env
# Domain mappings (comma-separated key:value pairs)
DOMAIN_MAPPINGS=tenant1.com:publisher-1,tenant2.com:publisher-2
```

**Update `lib/tenant-resolver.ts`:**
```typescript
const domainMap: Record<string, string> = {};

// Parse environment variable if available
if (process.env.DOMAIN_MAPPINGS) {
  process.env.DOMAIN_MAPPINGS.split(',').forEach(mapping => {
    const [domain, tenant] = mapping.split(':');
    if (domain && tenant) {
      domainMap[domain.trim()] = tenant.trim();
    }
  });
}
```

---

## Database-Driven Domain Mapping (Enterprise)

For large-scale deployments with hundreds of tenants, use a database:

```typescript
// lib/tenant-resolver.ts
export const domainStrategy: TenantResolutionStrategy = {
  type: 'domain',
  resolve: async (request: TenantRequest): Promise<string | null> => {
    const { hostname } = request;
    
    // Check cache first
    const cached = await redis.get(`domain:${hostname}`);
    if (cached) return cached;
    
    // Query database
    const mapping = await db.domainMappings.findOne({ domain: hostname });
    if (mapping) {
      // Cache for 1 hour
      await redis.set(`domain:${hostname}`, mapping.tenantId, 'EX', 3600);
      return mapping.tenantId;
    }
    
    return null;
  },
};
```

**Database Schema:**
```sql
CREATE TABLE domain_mappings (
  id SERIAL PRIMARY KEY,
  domain VARCHAR(255) UNIQUE NOT NULL,
  tenant_id VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_domain ON domain_mappings(domain);
```

---

## Testing Production Setup Locally

### Option 1: Edit Hosts File
```
# /etc/hosts (Mac/Linux) or C:\Windows\System32\drivers\etc\hosts
127.0.0.1 tenant1.com
127.0.0.1 tenant2.com
```

Then add to `domainMap`:
```typescript
'tenant1.com': 'publisher-1',
'tenant2.com': 'publisher-2',
```

Visit: `http://tenant1.com:3000`

### Option 2: Use ngrok/localhost.run
```bash
# Expose localhost with custom domain
ngrok http 3000 --hostname=tenant1.your-ngrok-domain.com
```

---

## Deployment Checklist

### Before Going Live:

- [ ] Configure domain mappings in `lib/tenant-resolver.ts`
- [ ] Set up DNS records (A/CNAME)
- [ ] Add domains to hosting platform (Vercel/Netlify)
- [ ] Wait for SSL provisioning (automatic)
- [ ] Test each domain resolves correctly
- [ ] Verify SEO metadata for each tenant
- [ ] Check Google Fonts loading
- [ ] Test responsive design on mobile
- [ ] Verify analytics tracking (if applicable)

### Production Environment Variables:

```env
# .env.production
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

---

## Common Issues & Solutions

### Issue: "Domain not resolving"
**Solution:** Wait 24-48 hours for DNS propagation. Use `dig tenant1.com` to check.

### Issue: "SSL certificate error"
**Solution:** Vercel/Netlify auto-provision SSL, but it takes 5-10 minutes. Be patient.

### Issue: "Wrong tenant loading"
**Solution:** Check domain mapping in `lib/tenant-resolver.ts` and console logs.

### Issue: "Subdomain not working"
**Solution:** Ensure wildcard CNAME is set: `* CNAME yourdomain.com`

---

## Recommended Production Setup

**For Small-Medium (1-50 tenants):**
- ✅ Subdomain strategy (`publisher-1.yourdomain.com`)
- ✅ Hardcoded domain mappings in code
- ✅ Deploy to Vercel/Netlify

**For Large (50-500 tenants):**
- ✅ Subdomain strategy + custom domains
- ✅ Environment variable-based mappings
- ✅ CDN caching (Cloudflare)

**For Enterprise (500+ tenants):**
- ✅ Database-driven domain mappings
- ✅ Redis caching layer
- ✅ Multi-region deployment
- ✅ Admin panel for domain management

---

## Summary

| Strategy | Use Case | Priority | Setup Complexity |
|----------|----------|----------|------------------|
| Custom Domain | Premium clients | 1st | Medium |
| Subdomain | All clients | 2nd | Easy |
| Path-based | Local dev only | 3rd | Very Easy |

**For your production:** Use **Custom Domains** or **Subdomains** (not path-based).

The system is already configured to handle all three strategies - just update the `domainMap` object with your production domains!

---

**Need Help?** Check the console logs - they show which strategy resolved each tenant.

