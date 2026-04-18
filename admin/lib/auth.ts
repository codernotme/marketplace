import { PrismaClient } from "../app/generated/prisma";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { admin } from "better-auth/plugins";

const client = new PrismaClient();

export const auth = betterAuth({
  database: prismaAdapter(client, { 
    provider: "postgresql",
  }),
  user: {
    modelName: "adminUser",
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "STORE_MANAGER"
      },
      phone: {
        type: "string",
        required: false
      },
      isActive: {
        type: "boolean",
        defaultValue: true
      },
      twoFactorEnabled: {
        type: "boolean",
        defaultValue: false
      }
    }
  },
  session: {
    modelName: "adminSession"
  },
  account: {
    modelName: "adminAccount"
  },
  verification: {
    modelName: "adminVerification"
  },
  plugins: [
    admin()
  ],
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000/",
  emailAndPassword: { enabled: true },
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
});
