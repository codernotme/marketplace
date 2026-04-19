import { prisma } from "@/lib/db";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { admin } from "better-auth/plugins";

export const auth = betterAuth({
  database: prismaAdapter(prisma, { 
    provider: "postgresql",
    // Map Better Auth's default table/field names to our custom Prisma model names
    usePlural: false,
  }),
  user: {
    modelName: "adminUser",
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "UNASSIGNED",
      },
      phone: {
        type: "string",
        required: false,
      },
      isActive: {
        type: "boolean",
        defaultValue: true,
      },
      twoFactorEnabled: {
        type: "boolean",
        defaultValue: false,
      },
    },
  },
  session: {
    modelName: "adminSession",
  },
  account: {
    modelName: "adminAccount",
  },
  verification: {
    modelName: "adminVerification",
  },
  // Force UNASSIGNED role on every new user creation.
  // The admin() plugin overrides additionalFields defaultValue with "user",
  // so we intercept at the database layer to enforce the correct enum value.
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          return {
            data: {
              ...user,
              role: "UNASSIGNED",
            },
          };
        },
      },
    },
  },
  plugins: [
    admin({
      defaultRole: "UNASSIGNED",
    }),
  ],
  // No trailing slash — Better Auth is strict about this
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    },
    microsoft: {
      clientId: process.env.MICROSOFT_CLIENT_ID || "",
      clientSecret: process.env.MICROSOFT_CLIENT_SECRET || "",
    },
  },
  trustedOrigins: [
    process.env.BETTER_AUTH_URL || "http://localhost:3000",
    process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3000",
  ],
});
