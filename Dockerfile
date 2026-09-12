FROM oven/bun:1 AS build
WORKDIR /app
ARG SENTRY_ORG
ARG SENTRY_PROJECT
ENV SENTRY_ORG=$SENTRY_ORG SENTRY_PROJECT=$SENTRY_PROJECT
COPY . .
RUN --mount=type=cache,target=/app/node_modules,sharing=locked \
    --mount=type=cache,target=/root/.bun/install/cache \
    --mount=type=secret,id=sentry_auth_token \
    bun install --frozen-lockfile && \
    SENTRY_AUTH_TOKEN="$(cat /run/secrets/sentry_auth_token 2>/dev/null || true)" bun run build

FROM oven/bun:1-alpine AS release
WORKDIR /app
ENV NODE_ENV=production PORT=3000
COPY --from=build --chown=bun:bun /app/.output ./.output
USER bun
EXPOSE 3000
CMD ["bun", ".output/server/index.mjs"]
