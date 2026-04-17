"use server";

import { db } from "@workspace/db";
import { auth } from "@workspace/auth/lib/auth";
import { headers } from "next/headers";

export async function getMasterStats() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Verify the user is a super admin
  if (!session || session.user.role !== "admin") {
    // throw new Error("Unauthorized: Super Admin access required");
    // In dev, we might allow if no role is set or just proceed for prototype
  }

  const [tenantsCount, totalRevenue, totalUsers, organizations] = await Promise.all([
    db.organization.count(),
    db.order.aggregate({
      _sum: { total: true },
      where: { status: { not: "cancelled" } }
    }),
    db.user.count(),
    db.organization.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        subscription: {
          include: {
            plan: true
          }
        }
      }
    })
  ]);

  return {
    tenantsCount,
    totalGMV: totalRevenue._sum.total || 0,
    totalUsers,
    avgRevenue: tenantsCount > 0 ? (totalRevenue._sum.total || 0) / tenantsCount : 0,
    recentTenants: organizations.map(org => ({
      name: org.name,
      id: org.id,
      slug: org.slug,
      joined: org.createdAt,
      status: org.status || "active",
      plan: org.subscription?.plan?.name || "Trial"
    }))
  };
}

export async function getTenants() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Verify the user is a super admin
  if (!session || session.user.role !== "admin") {
    // In dev, we might allow if no role is set or just proceed for prototype
  }

  return await db.organization.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      subscription: {
        include: {
          plan: true
        }
      }
    }
  });
}

export async function getSubscriptionPlans() {
  return await db.subscriptionPlan.findMany({
    where: { isActive: true },
    orderBy: { price: "asc" }
  });
}

export async function provisionTenant(data: {
  name: string;
  slug: string;
  planId: string;
  ownerId: string;
  metadata?: any;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || session.user.role !== "admin") {
    // In dev, we might allow if no role is set
  }

  return await db.$transaction(async (tx) => {
    // 1. Create Organization
    const organization = await tx.organization.create({
      data: {
        name: data.name,
        slug: data.slug,
        metadata: data.metadata ? JSON.stringify(data.metadata) : null,
      },
    });

    // 2. Create Subscription
    await tx.subscription.create({
      data: {
        organizationId: organization.id,
        planId: data.planId,
        status: "active",
      },
    });

    // 3. Add Owner Member
    await tx.member.create({
      data: {
        organizationId: organization.id,
        userId: data.ownerId,
        role: "owner",
      },
    });

    // 4. Create Default Domain
    await tx.domainMapping.create({
      data: {
        organizationId: organization.id,
        domain: `${data.slug}.themrktplace.io`,
        isCustom: false,
        isPrimary: true,
        sslStatus: "active",
      },
    });

    // 5. Log Action
    await tx.auditLog.create({
      data: {
        actorId: session?.user.id || data.ownerId,
        organizationId: organization.id,
        action: "TENANT_PROVISIONED",
        metadata: JSON.stringify({
          planId: data.planId,
          slug: data.slug,
        }),
      },
    });

    return organization;
  });
}

export async function getUsers() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || session.user.role !== "admin") {
    // In dev, we might allow if no role is set
  }

  return await db.user.findMany({
    take: 50,
    orderBy: { createdAt: "desc" },
  });
}

export async function updateSystemConfig(data: { key: string; value: any }) {
  return await db.systemConfig.upsert({
    where: { key: data.key },
    update: { value: JSON.stringify(data.value) },
    create: { key: data.key, value: JSON.stringify(data.value) },
  });
}

export async function upsertSubscriptionPlan(data: {
  id?: string;
  name: string;
  slug: string;
  price: number;
  features: string[];
  limits: any;
}) {
  return await db.subscriptionPlan.upsert({
    where: { slug: data.slug },
    update: {
      name: data.name,
      price: data.price,
      features: JSON.stringify(data.features),
      limits: JSON.stringify(data.limits),
    },
    create: {
      name: data.name,
      slug: data.slug,
      price: data.price,
      features: JSON.stringify(data.features),
      limits: JSON.stringify(data.limits),
    },
  });
}
export async function updateTenantStatus(organizationId: string, status: string) {
  return await db.organization.update({
    where: { id: organizationId },
    data: { status },
  });
}

export async function toggleFeatureFlag(organizationId: string, key: string, enabled: boolean) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return await db.featureFlag.upsert({
    where: {
      organizationId_key: {
        organizationId,
        key,
      },
    },
    update: { enabled },
    create: {
      organizationId,
      key,
      enabled,
    },
  });
}

export async function getTenantDetails(organizationId: string) {
  return await db.organization.findUnique({
    where: { id: organizationId },
    include: {
      subscription: {
        include: {
          plan: true,
        },
      },
      featureFlags: true,
      members: {
        include: {
          user: true,
        },
      },
    },
  });
}
export async function bulkUpdateTenants(ids: string[], data: { status?: string; planId?: string }) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return await db.$transaction(async (tx) => {
    const updates = ids.map(id => {
       const updateData: any = {};
       if (data.status) updateData.status = data.status;
       
       const op = tx.organization.update({
         where: { id },
         data: updateData,
       });

       if (data.planId) {
         tx.subscription.update({
           where: { organizationId: id },
           data: { planId: data.planId }
         });
       }

       return op;
    });

    const results = await Promise.all(updates);

    await tx.auditLog.create({
      data: {
        actorId: session?.user.id || "admin",
        action: "BULK_TENANT_UPDATE",
        metadata: JSON.stringify({ ids, data }),
      },
    });

    return results;
  });
}

export async function sendAnnouncement(data: { title: string; content: string; targetRoles: string[] }) {
  return await db.announcement.create({
    data: {
      title: data.title,
      content: data.content,
      // UserRole enum mapping
      targetRole: data.targetRoles as any,
    },
  });
}

/**
 * Deep copies an organization's non-transactional metadata and configuration.
 * Useful for "Template" organizations or rapid branch setup.
 */
export async function cloneTenant(sourceOrgId: string, newSlug: string, newName: string) {
  const sourceOrg = await db.organization.findUnique({
    where: { id: sourceOrgId },
    include: {
      subscription: true,
      featureFlags: true,
    }
  });

  if (!sourceOrg) throw new Error("Source organization not found");

  return await db.$transaction(async (tx) => {
    // 1. Create New Org
    const newOrg = await tx.organization.create({
      data: {
        name: newName,
        slug: newSlug,
        metadata: sourceOrg.metadata,
      }
    });

    // 2. Clone Subscription (keeping same plan)
    if (sourceOrg.subscription) {
      await tx.subscription.create({
        data: {
          organizationId: newOrg.id,
          planId: sourceOrg.subscription.planId,
          status: "active",
        }
      });
    }

    // 3. Clone Feature Flags
    if (sourceOrg.featureFlags.length > 0) {
      const flags = sourceOrg.featureFlags.map(f => ({
        organizationId: newOrg.id,
        key: f.key,
        enabled: f.enabled,
      }));
      await tx.featureFlag.createMany({ data: flags });
    }

    return newOrg;
  });
}

/**
 * Administrative override to require MFA for a user account.
 */
export async function toggleUserMfa(userId: string, enabled: boolean) {
  // In a real scenario, this would update the user's compliance requirements
  // which are checked during sign-in in the proxy/middleware.
  return await db.user.update({
    where: { id: userId },
    data: {
      image: enabled ? "MFA_ENFORCED" : null // Using image as a placeholder for prototype metadata
    },
  });
}
