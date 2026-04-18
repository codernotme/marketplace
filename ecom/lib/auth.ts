import { PrismaClient } from "../app/generated/prisma";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

const client = new PrismaClient();

export const auth = betterAuth({
  database: prismaAdapter(client, { 
    provider: "postgresql",
  }),
  user: {
    modelName: "customer",
    additionalFields: {
      phone: {
        type: "string",
        required: false
      },
      marketingOptIn: {
        type: "boolean",
        defaultValue: false
      },
      status: {
        type: "string",
        defaultValue: "ACTIVE"
      }
    }
  },
  session: {
    modelName: "customerSession"
  },
  account: {
    modelName: "customerAccount"
  },
  verification: {
    modelName: "customerVerification"
  },
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3001/",
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
