# Netlify Setup – Step-by-Step (Multi-Tenant, Domain-Based)

This guide assumes a **new** Netlify project: your app is in Git and not yet connected to Netlify.

**Current setup (for now):** Saudi Center uses Netlify’s default subdomain — no custom domain or DNS needed yet.

- **Production:** `https://saudi-recitation-center.netlify.app`  
- **Staging:** `https://staging--saudi-recitation-center.netlify.app`  

Create the site with **site name** `saudi-recitation-center` so Netlify gives you that URL. Custom domains can be added later.

---

## Prerequisites

- [ ] Code in a **Git** repo (GitHub, GitLab, or Bitbucket).
- [ ] A **Netlify account** ([netlify.com](https://www.netlify.com) → Sign up / Log in).
- [ ] (Later) Access to **DNS** for custom domains when you add them.

---

## Part 1: Create the site and first deploy

### Step 1: Add the site from Git

1. Log in at [app.netlify.com](https://app.netlify.com).
2. Click **“Add new site”** → **“Import an existing project”**.
3. Choose your Git provider (e.g. **GitHub**) and authorize Netlify if asked.
4. Pick the **repository** that contains this Next.js app (e.g. `landing-app`).
5. Pick the **branch** to deploy (e.g. `main` or `master`). This branch will be your **production** branch.

### Step 2: Build settings (usually auto-detected)

Netlify normally detects Next.js and sets:

| Setting            | Value          | Notes                                      |
|--------------------|----------------|--------------------------------------------|
| Build command      | `npm run build` or `next build` | Leave as detected.              |
| Publish directory  | (Next.js default) | Netlify uses the Next.js runtime; leave default. |
| Base directory     | (empty)        | Set only if the app is in a subfolder.     |

If you see **“Framework: Next.js”** and a build command like `npm run build`, you’re good. Do **not** set “Publish directory” to `.next` — Netlify’s Next.js support handles that.

Click **“Deploy site”** (or **“Deploy [site name]”**).

### Step 3: Set the site name (so URLs match the app config)

When creating the site, set the **site name** to **`saudi-recitation-center`** so your URLs are:

- **Production:** `https://saudi-recitation-center.netlify.app`
- **Staging (after you add a staging branch):** `https://staging--saudi-recitation-center.netlify.app`

If you already created the site with a random name: **Site configuration** → **General** → **Site name** → change to `saudi-recitation-center` and save.

### Step 4: Wait for the first deploy

- Netlify will run `npm install` and `npm run build`.
- First deploy can take a few minutes.
- When it’s done, open `https://saudi-recitation-center.netlify.app` — you should see the Saudi Center tenant with clean URLs.

### Step 5: (Optional) Set Node version

If the build fails with a Node version error:

1. In the repo root, create or edit **`netlify.toml`**.
2. Add:

```toml
[build.environment]
  NODE_VERSION = "20"
```

(Use 18 or 20; 20 is a safe default.) Commit, push, and redeploy.

---

## Part 2: Custom domain (optional, for later)

When you’re ready to use a custom domain (e.g. `saudi-recitations-center.com`), point it to this **same** Netlify site and update `config/tenants.json` → `domain` for the tenant. The app resolves the tenant from the hostname.

**For now:** Skip Part 2 and use `saudi-recitation-center.netlify.app` and `staging--saudi-recitation-center.netlify.app`.

### Step 6: Add the custom domain in Netlify

1. In Netlify: **Site overview** → **Domain management** (or **“Set up a custom domain”**).
2. Click **“Add domain”** / **“Add custom domain”**.
3. Enter the **full domain**, e.g. `saudi-recitations-center.com` (no `https://`).
4. Click **“Verify”** / **“Add domain”**.
5. Netlify will show you what DNS records to create (next step). Leave this tab open.

### Step 7: Configure DNS at your registrar

Go to where you manage DNS for `saudi-recitations-center.com` (e.g. Cloudflare, Namecheap, GoDaddy).

**Option A – Netlify DNS (simplest)**  
- In Netlify: **Domain management** → **“Use Netlify DNS”** for this domain.  
- Netlify will give you **nameservers** (e.g. `dns1.p01.nsone.net`).  
- At your registrar, change the domain’s **nameservers** to those.  
- Netlify then creates the right A/CNAME and handles SSL.

**Option B – DNS at your registrar**  
Create **one** of these:

- **A record**  
  - Name: `@` (or blank, meaning “root domain”).  
  - Value: `75.2.60.5` (Netlify’s load balancer).  
  - TTL: 3600 or “Auto”.

- **CNAME (for www)**  
  - Name: `www`.  
  - Value: `<your-site-name>.netlify.app` (from Netlify’s instructions).  
  - TTL: 3600 or “Auto”.

So:

- `saudi-recitations-center.com` → A record `@` → `75.2.60.5`.
- `www.saudi-recitations-center.com` (optional) → CNAME `www` → `<site>.netlify.app`.

### Step 8: HTTPS (SSL)

1. Back in Netlify → **Domain management**.
2. After DNS propagates (minutes to 48 hours), Netlify will issue a certificate for `saudi-recitations-center.com`.
3. **HTTPS** → Turn **on** “Force HTTPS” so all traffic uses `https://`.

### Step 9: Test production domain

- With **Netlify subdomain (current):** Open `https://saudi-recitation-center.netlify.app` — you should see the Saudi Center tenant with clean URLs (`/`, `/recitations`, etc.). Try `https://saudi-recitation-center.netlify.app/saudi-center` — it should **404**.  
- With **custom domain (later):** Open `https://saudi-recitations-center.com` and test the same way.

---

## Part 3: Staging (branch deploy + optional custom domain)

Staging uses a **separate branch** (e.g. `staging`). Netlify gives that branch a URL like `staging--<site-name>.netlify.app`. Your app also supports a custom staging domain like `staging--saudi-recitations-center.com` (see `lib/domains.ts`).

### Step 10: Enable branch deploys and create staging branch

1. In Netlify: **Site configuration** → **Build & deploy** → **Continuous deployment**.
2. Under **Branch deploys**, choose **“All”** (or at least enable **“Deploy previews”** and the **staging** branch).
3. In your repo, create and push a **staging** branch:

   ```bash
   git checkout -b staging
   git push -u origin staging
   ```

4. Netlify will build `staging`. When it’s done, you’ll have:
   - **Production:** `main` → `https://saudi-recitation-center.netlify.app`
   - **Staging:** `staging` → `https://staging--saudi-recitation-center.netlify.app`

### Step 11: (Optional) Custom domain for staging

If you later add a custom domain and want `https://staging--saudi-recitations-center.com` to open the **staging** deploy:

1. **Domain management** → **Add domain** → enter `staging--saudi-recitations-center.com`.
2. In DNS (registrar or Netlify DNS), add:
   - **CNAME**: Name `staging--saudi-recitations-center` (or the subdomain Netlify shows), Value `staging--<site-name>.netlify.app`.  
   Or use the **exact** hostname Netlify tells you (e.g. they might want `staging--saudi-recitations-center.com` → `staging--<site>.netlify.app`).
3. In Netlify, **assign** this domain to the **staging** branch:
   - **Domain management** → click the domain → **“Branch”** or **“Deploy context”** → set to **staging** (or “Branch deploy: staging”).

After DNS and SSL are ready, that staging domain will serve the **staging** branch; your app will resolve it as the same tenant (staging--domain is mapped in `lib/domains.ts`). **For now**, use `https://staging--saudi-recitation-center.netlify.app` — no custom domain needed.

---

## Part 4: Environment variables (if you use them)

**Backend API per environment (required for Saudi Center):**

Per-tenant API URLs are in `config/tenants.json` (Saudi Center: **development** `https://develop.api.cms.itqan.dev`, **staging** `https://staging.api.cms.itqan.dev`, **production** `https://api.cms.itqan.dev`). The app picks which URL to use:

- **Localhost** (NODE_ENV=development): uses `api.development`.
- **Netlify staging branch**: set **`NEXT_PUBLIC_ENV=staging`** → uses `api.staging`.
- **Netlify production branch**: uses `api.production` (no env needed, or set `NEXT_PUBLIC_ENV=production`).

1. **Site configuration** → **Environment variables** → **Add a variable**.
2. Add **`NEXT_PUBLIC_ENV`** with **scope**:
   - **Production** (main branch): leave unset or value **`production`** → app uses `api.production`.
   - **Staging** (staging branch): value **`staging`** → app uses `api.staging`.
3. In Netlify set different values per branch (Scopes / Deploy contexts) so the staging branch gets `staging`.
4. **Redeploy** after changing env vars.

Optional fallback (if a tenant has no `api` in config): **`NEXT_PUBLIC_API_URL`** (e.g. `https://api.cms.itqan.dev`).

---

## Part 5: Optional netlify.toml (one place for settings)

You can put build and redirect rules in the repo so the whole team (and future you) see the setup.

Create **`netlify.toml`** in the project root:

```toml
[build]
  command = "npm run build"

# Optional: pin Node version
[build.environment]
  NODE_VERSION = "20"

# Optional: redirect www to non-www (or the opposite)
# [[redirects]]
#   from = "https://www.saudi-recitations-center.com/*"
#   to = "https://saudi-recitations-center.com/:splat"
#   status = 301
#   force = true
```

Commit and push. Netlify will use this on the next deploy.

---

## Checklist summary

| Step | What | Where |
|------|------|--------|
| 1–5  | Create site from Git, set site name to `saudi-recitation-center`, first deploy, optional Node in `netlify.toml` | Netlify UI + repo |
| 6–9  | (Later) Add custom domain, DNS, HTTPS | Netlify + DNS registrar |
| 10–11| Branch deploy for staging → `staging--saudi-recitation-center.netlify.app`, optional staging custom domain | Netlify + DNS |
| Env  | Environment variables if needed | Netlify → Environment variables |

---

## Multiple tenants later

When you add another tenant with its own domain (e.g. `second-tenant.com`):

1. Add `"domain": "second-tenant.com"` to that tenant in **`config/tenants.json`**.
2. In Netlify **Domain management**, add the domain **second-tenant.com** to the **same** site.
3. Point DNS for `second-tenant.com` to Netlify (A record `75.2.60.5` or CNAME to `<site>.netlify.app`).

No new Netlify site is needed; one site serves all tenants by domain.

---

## Troubleshooting

- **Build fails:** Check the **Deploy log** in Netlify. Often it’s Node version (set `NODE_VERSION` in `netlify.toml`) or missing env vars.
- **Domain “Not verified”:** Wait for DNS (up to 48 hours). Use `dig saudi-recitations-center.com` or [dnschecker.org](https://dnschecker.org) to confirm the A/CNAME.
- **Wrong tenant or 404:** Confirm the hostname in `config/tenants.json` matches the domain exactly (no `www` unless you added it), and that middleware/domains see the same host (no proxy stripping it).
- **Staging URL:** Use the **Deploy** tab → pick the **staging** deploy → “Preview” / “Open production deploy” to get the exact `staging--<site>.netlify.app` URL.
