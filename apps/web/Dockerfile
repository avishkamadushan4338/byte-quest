FROM oven/bun:1.4.0 AS builder
WORKDIR /app

COPY . .
RUN --mount=type=cache,target=/root/.bun/install/cache bun install --frozen-lockfile

# Ensure native sharp linux-x64 prebuilts are explicitly installed for the runner
RUN cd /app/apps/web && bun add @img/sharp-linux-x64 sharp

ENV NODE_ENV=production \
    SKIP_ENV_VALIDATION=1 \
    VARLOCK_SKIP_VALIDATION=1 \
    VARLOCK_SKIP_CODEGEN=1 \
    BETTER_AUTH_SECRET=jzhHZQmHEdvyScLuQ3vcaGUB7HNV8PJb \
    BETTER_AUTH_URL=http://localhost:5001 \
    ADMIN_PASSWORD=build-placeholder-not-used \
    TURSO_DATABASE_URL=libsql://byte-quest-tenuka22.aws-ap-northeast-1.turso.io

RUN cd apps/web && bun run build

FROM node:24-slim AS runner
WORKDIR /app

ENV NODE_ENV=production \
    TZ=UTC \
    PORT=5001 \
    HOST=0.0.0.0 \
    VARLOCK_SKIP_VALIDATION=1 \
    VARLOCK_SKIP_CODEGEN=1

COPY --from=builder /app /app

EXPOSE 5001

WORKDIR /app/apps/web
USER node

CMD ["sh", "-c", "node /app/scripts/migrate.mjs && exec node .output/server/index.mjs"]
