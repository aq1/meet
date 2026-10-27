FROM oven/bun:1-alpine
WORKDIR /app
ENV NODE_ENV=production PORT=3000
COPY --chown=bun:bun .output ./.output
COPY --chown=bun:bun drizzle ./drizzle
USER bun
EXPOSE 3000
CMD ["bun", ".output/server/index.mjs"]
