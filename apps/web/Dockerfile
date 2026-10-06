# syntax=docker/dockerfile:1

# Base image pinned to the exact Bun version pinned in package.json's "packageManager" field
ARG BUN_VERSION=1.4.0

########################################################################
# deps - install every workspace dependency once, from the lockfile only.
########################################################################
FROM oven/bun:${BUN_VERSION}-slim AS deps
WORKDIR /app

COPY package.json bun.lock bunfig.toml ./
COPY packages/config/package.json packages/config/
COPY packages/db/package.json packages/db/
COPY packages/db/.env.schema packages/db/.env.schema
COPY packages/auth/package.json packages/auth/
COPY packages/api/package.json packages/api/
COPY packages/ui/package.json packages/ui/
COPY apps/web/package.json apps/web/
COPY apps/web/.env.schema apps/web/.env.schema

RUN bun install --frozen-lockfile

########################################################################
# builder - compile the TanStack Start app to a self-contained Nitro bundle.
########################################################################
FROM deps AS builder
WORKDIR /app

COPY packages/ packages/
COPY apps/web/ apps/web/

ENV NODE_ENV=production \
    SKIP_ENV_VALIDATION=1 \
    VARLOCK_SKIP_VALIDATION=1 \
    BETTER_AUTH_SECRET=jzhHZQmHEdvyScLuQ3vcaGUB7HNV8PJb \
    BETTER_AUTH_URL=http://localhost:4001 \
    DATABASE_URL=libsql://byte-quest-tenuka22.aws-ap-northeast-1.turso.io

RUN cd apps/web && bun run build

########################################################################
# runner - the smallest tree that can serve the build and run migrations.
########################################################################
FROM oven/bun:${BUN_VERSION}-slim AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN apt-get update && apt-get install -y --no-install-recommends nodejs && rm -rf /var/lib/apt/lists/*

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/package.json ./package.json
COPY --from=deps /app/bun.lock ./bun.lock

COPY packages/db/ packages/db/

COPY --from=builder --chown=bun:bun /app/apps/web/.output ./.output

RUN mkdir -p /app/data && chown bun:bun /app/data
USER bun

ENV PORT=4001
EXPOSE 4001

HEALTHCHECK --interval=10s --timeout=5s --start-period=30s --retries=5 \
  CMD bun -e "fetch('http://127.0.0.1:'+(process.env.PORT||4001)+'/').then((r) => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"

CMD ["sh", "-c", "cd packages/db && bun run db:migrate:deploy && cd /app && exec node .output/server/index.mjs"]
