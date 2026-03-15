FROM node:22-slim AS runner

WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 drizzle

# We expect the build to be done on the host
COPY packages/db/dist /app/dist

CMD ["/bin/sh"]
