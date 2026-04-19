import { PrismaClient } from "@/app/generated/prisma";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { withAccelerate } from "@prisma/extension-accelerate";

const globalForPrisma = globalThis as unknown as {
  prisma: any;
};

function createPrismaClient() {
  const url = process.env.DATABASE_URL || "";

  // Prisma v7 constructor for Accelerate
  if (url.startsWith("prisma+")) {
    return new PrismaClient({
      // @ts-ignore - accelerateUrl is the new v7 property for Accelerate
      accelerateUrl: url,
      log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    }).$extends(withAccelerate());
  }

  // Prisma v7 constructor for Direct Connection via Adapter
  const pool = new Pool({ connectionString: url });
  const adapter = new PrismaPg(pool);
  
  return new PrismaClient({
    // @ts-ignore - adapter is the standard way to connect in v7
    adapter,
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });
}

export const prisma =
  globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
