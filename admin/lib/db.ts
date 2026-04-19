import { PrismaClient } from "@/app/generated/prisma";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const getPrismaOptions = () => {
  const url = process.env.DATABASE_URL || "";
  if (url.startsWith("prisma+")) {
    return { accelerateUrl: url };
  } else {
    const pool = new Pool({ connectionString: url });
    const adapter = new PrismaPg(pool);
    return { adapter };
  }
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    ...getPrismaOptions(),
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  } as any);

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
