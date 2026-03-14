import { appRouter, createTRPCContext } from "@acme/api";
import { initAuth } from "@acme/auth";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";

import { env } from "./env";

const auth = initAuth({
  baseUrl: env.PUBLIC_SERVER_URL,
  productionUrl: env.PUBLIC_WEB_URL, // In production setup, web URL works as production URL for proxy
  secret: env.AUTH_SECRET,
});

const app = new Hono<{
  Variables: {
    user: ReturnType<typeof initAuth>["$Infer"]["Session"]["user"] | null;
    session: ReturnType<typeof initAuth>["$Infer"]["Session"]["session"] | null;
  };
}>();

app.get("/healthcheck", (c) => {
  return c.text("OK");
});

app.use(logger());

const trustedOrigins = [env.PUBLIC_WEB_URL].map((url) => new URL(url).origin);

app.use(
  "/api/*",
  cors({
    origin: trustedOrigins,
    credentials: true,
  }),
);

// Better Auth handler
app.on(["POST", "GET"], "/api/auth/**", (c) => {
  return auth.handler(c.req.raw);
});

// tRPC handler
app.use("/api/trpc/*", async (c) => {
  const res = await fetchRequestHandler({
    endpoint: "/api/trpc",
    req: c.req.raw,
    router: appRouter,
    createContext: () => createTRPCContext({ headers: new Headers(c.req.raw.headers), auth }),
  });
  return res;
});

export default app;
