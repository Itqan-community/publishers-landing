/**
 * Server-only: resolve backend API base URL per tenant and environment.
 * Used only to pass backendUrl to client components; the browser calls the API
 * directly (no proxy). Do not import from client components (uses next/headers).
 */

import { headers } from "next/headers";
import tenantConfigs from "@/config/tenants.json";
import { getDefaultTenantId } from "@/lib/tenant-config";
import type { TenantConfig } from "@/types/tenant.types";

/** Deploy environment derived from request (hostname) or fallback env vars. */
export type DeployEnv = "development" | "staging" | "production";

/**
 * Resolve deploy environment: development (localhost), staging (hostname starts with staging--), production.
 * Uses request hostname from middleware (x-hostname) so staging always uses staging API regardless of build-time env.
 */
export async function getDeployEnv(): Promise<DeployEnv> {
  if (process.env.NODE_ENV === "development") return "development";
  try {
    const h = await headers();
    const hostname = h.get("x-hostname") ?? h.get("host") ?? "";
    if (hostname.startsWith("staging--")) return "staging";
  } catch {
    // Build time or no request context: use env var
    if (process.env.NEXT_PUBLIC_ENV === "staging") return "staging";
  }
  return "production";
}

/**
 * Get the backend API URL for a tenant based on the current request environment.
 *
 * - Uses tenant's api.development / api.staging / api.production from config/tenants.json.
 * - Environment is derived from the request so it works on Netlify without build-time env:
 *   - localhost (NODE_ENV=development) → api.development (staging.api.cms.itqan.dev)
 *   - hostname starts with "staging--" (e.g. staging--saudi-recitation-center.netlify.app) → api.staging (staging.api.cms.itqan.dev)
 *   - else → api.production (api.cms.itqan.dev)
 *
 * @param tenantId - Tenant ID (e.g. "saudi-center"). Uses default tenant if omitted.
 */
export async function getBackendUrl(tenantId?: string): Promise<string> {
  const id = tenantId ?? getDefaultTenantId();
  const config = (tenantConfigs as Record<string, TenantConfig>)[id];
  const env = await getDeployEnv();

  if (config?.api) {
    const url = config.api[env] ?? config.api.production;
    return (url ?? "").replace(/\/$/, "");
  }

  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "");
  }

  const defaults: Record<DeployEnv, string> = {
    development: "https://staging.api.cms.itqan.dev/tenant",
    staging: "https://staging.api.cms.itqan.dev/tenant",
    production: "https://api.cms.itqan.dev/tenant",
  };
  return defaults[env].replace(/\/$/, "");
}
