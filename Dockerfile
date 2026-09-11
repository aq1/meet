FROM oven/bun:1 AS base
WORKDIR /app

# Install dependencies
FROM base AS deps
COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile

# Build
FROM base AS build
ARG SENTRY_ORG
ARG SENTRY_PROJECT
ENV SENTRY_ORG=$SENTRY_ORG SENTRY_PROJECT=$SENTRY_PROJECT
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN --mount=type=secret,id=sentry_auth_token \
    SENTRY_AUTH_TOKEN="$(cat /run/secrets/sentry_auth_token 2>/dev/null || true)" \
    bun run build

# Production dependencies
FROM base AS prod-deps
COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile --production

# Production
FROM base AS release
ENV NODE_ENV=production
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=build /app/.output ./.output
COPY package.json tsconfig.json ./
COPY src ./src
COPY scripts ./scripts

CMD ["bun", "run", ".output/server/index.mjs"]
