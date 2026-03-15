FROM node:22-slim AS runner

WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nodejs
USER nodejs

# We expect the build to be done on the host
COPY apps/tanstack-start/.output /app/.output

EXPOSE 3000
ENV PORT=3000

CMD ["node", "/app/.output/server/index.mjs"]
