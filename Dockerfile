# Base stage where we setup pnpm and copy the package files to later install dependencies
FROM node:26.13.0-alpine AS base
WORKDIR /app
RUN npm install -g pnpm@12.16.1
COPY package.json ./
COPY pnpm-lock.yaml ./
COPY pnpm-workspace.yaml ./


# Build stage where we install all the dependencies and create the production build
FROM base AS build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
COPY tsconfig.json ./
COPY next.config.ts ./
COPY public ./public
COPY src ./src
RUN pnpm build


# Final stage where we get the production build and run it
FROM node:26.13.0-alpine

# Create a group and a user to avoid being root in the container
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

# Copy the build from the previous stage
COPY --from=build --chown=nextjs:nodejs /app/.next/standalone ./.next/standalone

# Necessary to run in Kubernetes
ENV HOSTNAME="0.0.0.0"

ENTRYPOINT ["node", ".next/standalone/server.js"]
