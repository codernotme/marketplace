import { prisma } from "@/lib/db";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
    usePlural: false,
  }),
  user: {
    modelName: "customer",
    additionalFields: {
      phone: {
        type: "string",
        required: false,
      },
      marketingOptIn: {
        type: "boolean",
        defaultValue: false,
      },
      status: {
        type: "string",
        defaultValue: "ACTIVE",
      },
    },
  },
  session: {
    modelName: "customerSession",
    fields: {
      userId: "customerId",
    },
  },
  account: {
    modelName: "customerAccount",
    fields: {
      userId: "customerId",
    },
  },
  verification: {
    modelName: "customerVerification",
  },
  // No trailing slash
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
