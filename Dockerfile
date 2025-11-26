FROM node:24.11.0-alpine AS base

# Install dependencies
FROM base AS deps
WORKDIR /app
COPY package.json ./
COPY package-lock.json ./
RUN npm ci

# Copy the source code files and generate the production build
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY tsconfig.json ./
COPY next.config.ts ./
COPY package.json ./
COPY public ./public
COPY src ./src
RUN npm run build


FROM base AS runner
WORKDIR /app

# Create a group and a user to avoid being root in the container
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

# Copy the build from the previous stage
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./.next/standalone

# Necessary to run in Kubernetes
ENV HOSTNAME "0.0.0.0"

ENTRYPOINT ["node", ".next/standalone/server.js"]
