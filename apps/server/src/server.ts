import { serve } from "@hono/node-server";

import app from "./index";
import { env } from "./env";

const server = serve(
  {
    fetch: app.fetch,
    port: env.PORT,
    hostname: env.HOST,
  },
  (info) => {
    const host = info.family === "IPv6" ? `[${info.address}]` : info.address;
    console.log(`
Hono Server Setup:
- internal server url: http://${host}:${info.port}
- external server url: ${env.PUBLIC_SERVER_URL}
- public web url:      ${env.PUBLIC_WEB_URL}
    `);
  },
);

const shutdown = () => {
  console.log("Shutting down...");
  server.close((error) => {
    if (error) {
      console.error(error);
    } else {
      console.log("Server has stopped gracefully.");
    }
    process.exit(0);
  });
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
