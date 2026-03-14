import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
    NODE_ENV: z
      .enum(["development", "production", "test"])
      .default("development"),
    PORT: z.coerce.number().default(3001),
    HOST: z.string().default("0.0.0.0"),
    DATABASE_URL: z.string().url(),
    AUTH_SECRET: z.string().min(1),

    PUBLIC_WEB_URL: z.string().url().default("http://localhost:3000"),
    PUBLIC_SERVER_URL: z.string().url().default("http://localhost:3001"),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});
