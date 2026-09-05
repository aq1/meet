FROM oven/bun:1 AS base
WORKDIR /app

# Install dependencies
FROM base AS deps
COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile

# Build
FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN bun run build

# Production
FROM base AS release
ENV NODE_ENV=production
COPY --from=build /app/.output ./.output
COPY package.json ./

CMD ["bun", "run", ".output/server/index.mjs"]
