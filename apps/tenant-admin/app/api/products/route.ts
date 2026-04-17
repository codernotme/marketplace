import { NextResponse } from "next/server";
import { db } from "@workspace/db";
import { auth } from "@workspace/auth";

/**
 * Programmatic API for Products.
 * Allows external integrations (or the storefront) to fetch product data.
 * Requires tenant-scoped authentication via session or API Key.
 */
export async function GET(req: Request) {
  const session = await auth.api.getSession({
    headers: await req.headers,
  });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const orgId = session.session.activeOrganizationId;

  if (!orgId) {
    return NextResponse.json({ error: "Organization contextual identity required" }, { status: 400 });
  }

  try {
    const products = await db.product.findMany({
      where: {
        organizationId: orgId,
      },
      include: {
        variants: true,
        category: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
      take: 50,
    });

    return NextResponse.json({ products });
  } catch (error) {
    console.error(`[API] Error fetching products:`, error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
