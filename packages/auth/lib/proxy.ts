import { UserRole } from "@workspace/db";

export type ProjectApp = "landing" | "master-admin" | "tenant-admin" | "pos" | "storefront";

export const APP_ROOTS: Record<ProjectApp, string> = {
  landing: process.env.NEXT_PUBLIC_LANDING_URL || "http://localhost:3000",
  "master-admin": process.env.NEXT_PUBLIC_MASTER_ADMIN_URL || "http://master.localhost:3000",
  "tenant-admin": process.env.NEXT_PUBLIC_TENANT_ADMIN_URL || "http://admin.localhost:3000",
  pos: process.env.NEXT_PUBLIC_POS_URL || "http://pos.localhost:3000",
  storefront: process.env.NEXT_PUBLIC_STOREFRONT_URL || "http://localhost:3000",
};

/**
 * Determines the primary app for a user based on their role.
 */
export function getPrimaryApp(role: UserRole | string): ProjectApp {
  switch (role) {
    case "PLATFORM_ADMIN":
      return "master-admin";
    case "TENANT_OWNER":
    case "TENANT_ADMIN":
      return "tenant-admin";
    case "STAFF":
      return "pos";
    case "CUSTOMER":
    default:
      return "storefront";
  }
}

/**
 * Checks if a user role has permission to access a specific app.
 */
export function canAccessApp(role: UserRole | string, app: ProjectApp): boolean {
  if (role === "PLATFORM_ADMIN") return true; // Super admin can access everything
  
  switch (app) {
    case "master-admin":
      return role === "PLATFORM_ADMIN";
    case "tenant-admin":
      return ["TENANT_OWNER", "TENANT_ADMIN"].includes(role);
    case "pos":
      return ["TENANT_OWNER", "TENANT_ADMIN", "STAFF"].includes(role);
    case "storefront":
    case "landing":
      return true;
    default:
      return false;
  }
}

/**
 * Resolves the tenant slug and app type from the request headers/hostname.
 * Assumes format: [app].[tenant].themrktplace.io or [tenant].themrktplace.io (storefront)
 */
export function resolveRequestMeta(hostname: string) {
  const parts = hostname.split(".");
  
  // master.localhost:3000 or master.themrktplace.io
  if (parts[0] === "master") {
    return { app: "master-admin" as ProjectApp, tenant: null };
  }

  // admin.tenant1.localhost:3000 or admin.tenant1.themrktplace.io
  if (parts[0] === "admin") {
    return { app: "tenant-admin" as ProjectApp, tenant: parts[1] };
  }

  // pos.tenant1.localhost:3000 or pos.tenant1.themrktplace.io
  if (parts[0] === "pos") {
    return { app: "pos" as ProjectApp, tenant: parts[1] };
  }

  // tenant1.localhost:3000 or tenant1.themrktplace.io -> storefront
  if (parts.length >= 3 || (parts.length === 2 && parts[1] === "localhost")) {
     return { app: "storefront" as ProjectApp, tenant: parts[0] };
  }

  return { app: "landing" as ProjectApp, tenant: null };
}
