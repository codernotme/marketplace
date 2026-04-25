# Base stage for shared environment
FROM node:22-alpine AS base
RUN apk add --no-cache libc6-compat
WORKDIR /app
# Install turbo globally
RUN npm install -g turbo@^2.8.17

# Prune stage
FROM base AS pruner
COPY . .
RUN turbo prune --scope=@themrktplace/api --docker

# Installer stage
FROM base AS installer
# First copy the pruned package.json and lockfile
COPY --from=pruner /app/out/json/ .
# In npm workspaces, we don't need a separate workspace file like pnpm,
# but we do need the package-lock.json if it exists.
# Since we are switching, we might not have it yet, so we'll run npm install.
RUN npm install

# Build stage
FROM base AS builder
COPY --from=installer /app/ .
COPY --from=pruner /app/out/full/ .
COPY turbo.json turbo.json
# Generate Prisma client first
RUN npx turbo run prisma:generate --filter=@themrktplace/api
# Build the api
RUN npx turbo run build --filter=@themrktplace/api

# Runner stage
FROM node:22-alpine AS runner
WORKDIR /app

RUN apk add --no-cache curl

# Don't run production as root
RUN addgroup --system --gid 1001 fastify
RUN adduser --system --uid 1001 fastify

# Copy built assets
COPY --from=builder --chown=fastify:fastify /app .

USER fastify

EXPOSE 3001

# The path to the built server.js depends on the build output of @themrktplace/api
# Based on apps/api/package.json: "start": "node dist/server.js"
CMD ["node", "apps/api/dist/server.js"]
