FROM node:20-alpine AS base

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
COPY next-env.d.ts ./
COPY next.config.js ./
COPY package.json ./
COPY public ./public
COPY src ./src

# Leave us alone with your telemetry
ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build


FROM base AS runner
WORKDIR /app

# We still don't want your telemetry
ENV NEXT_TELEMETRY_DISABLED 1

# Create a group and a user to avoid being root in the container
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

ENV PORT 3000
EXPOSE 3000

CMD ["node", "server.js"]
