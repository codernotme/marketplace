import { defineConfig, env } from "@prisma/config";

export default defineConfig({
  datasource: {
    url: process.env.DATABASE_URL || "postgresql://user:password@localhost:5432/marketplace?schema=public",
  },
});
