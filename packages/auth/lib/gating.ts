import { db } from "@workspace/db";

export type FeatureKey = 
  | "advanced_analytics"
  | "custom_domains"
  | "multi_warehouse"
  | "api_access"
  | "white_label"
  | "bulk_operations";

export type PlanLimit = 
  | "max_products"
  | "max_staff"
  | "max_storage_gb";

/**
 * Checks if an organization has access to a specific feature flag.
 */
export async function checkFeature(organizationId: string, feature: FeatureKey): Promise<boolean> {
  // 1. Get organization with its subscription and plan
  const org = await db.organization.findUnique({
    where: { id: organizationId },
    include: {
      subscription: {
        include: {
          plan: true
        }
      },
      featureFlags: {
        where: { key: feature }
      }
    }
  });

  if (!org) return false;

  // 2. Check override feature flags first (explicitly enabled for this tenant)
  const override = org.featureFlags[0];
  if (override) return override.enabled;

  // 3. Check plan defaults
  const planFeatureFlags = org.subscription?.plan?.featureFlags as Record<string, boolean> | undefined;
  if (planFeatureFlags && planFeatureFlags[feature] !== undefined) {
    return planFeatureFlags[feature];
  }

  return false;
}

/**
 * Checks if a resource creation is within plan limits.
 */
export async function checkLimit(organizationId: string, limitKey: PlanLimit, currentCount: number): Promise<{ allowed: boolean; limit: number }> {
    const org = await db.organization.findUnique({
      where: { id: organizationId },
      include: {
        subscription: {
          include: {
            plan: true
          }
        }
      }
    });
  
    if (!org || !org.subscription?.plan) {
        return { allowed: false, limit: 0 };
    }
  
    const planLimits = org.subscription.plan.limits as Record<string, number> | undefined;
    const limitValue = planLimits?.[limitKey] ?? 0;
  
    // limitValue === -1 means unlimited
    if (limitValue === -1) return { allowed: true, limit: -1 };
  
    return {
      allowed: currentCount < limitValue,
      limit: limitValue
    };
  }
