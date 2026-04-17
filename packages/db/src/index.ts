import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

/**
 * Detects if the current environment is a restricted runtime (like Next.js Edge Runtime).
 * In these environments, the standard PrismaClient (TCP-based) is not supported.
 */
const isRestrictedRuntime =
  process.env.NEXT_RUNTIME === "edge" ||
  // @ts-ignore
  typeof EdgeRuntime !== "undefined";

/**
 * Singleton pattern with a Lazy Proxy.
 * This ensures:
 * 1. Only one instance of PrismaClient exists in development (prevents DB connection limits).
 * 2. Modules can be imported safely in Edge Runtime / Middleware without crashing during evaluation.
 * 3. Descriptive errors are thrown if DB access is attempted in a restricted environment.
 */
function createPrismaClient() {
  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });
}

export const db = new Proxy({} as PrismaClient, {
  get(target, prop) {
    if (prop === "then") return undefined;
    if (prop === "$$typeof") return undefined;

    if (isRestrictedRuntime) {
      // Return a recursive proxy that throws on any method call
      return new Proxy({} as any, {
        get(_, innerProp) {
          if (typeof innerProp === "symbol") return {};
          return (...args: any[]) => {
            throw new Error(
              `Prisma operation "${String(prop)}.${String(innerProp)}" is not supported in the Edge Runtime. ` +
              "Please use a compute/fetch-based pattern or ensure the code only runs in Node.js (e.g., Server Actions, API routes)."
            );
          };
        }
      });
    }

    // Node.js Runtime Singleton
    if (!globalForPrisma.prisma) {
      globalForPrisma.prisma = createPrismaClient();
    }
    
    // Ensure we don't return null if prisma is somehow undefined
    const client = globalForPrisma.prisma!;
    const val = (client as any)[prop];
    
    // Bind functions to the client
    if (typeof val === "function") {
      return val.bind(client);
    }
    
    return val;
  },
});

export * from "@prisma/client";
