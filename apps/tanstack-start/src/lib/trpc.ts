import { createIsomorphicFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import {
  createTRPCClient,
  httpBatchStreamLink,
  loggerLink,
} from "@trpc/client";
import { createTRPCContext } from "@trpc/tanstack-react-query";
import SuperJSON from "superjson";

import type * as Api from "@acme/api";

import { env } from "~/env";
import { getBaseUrl } from "~/lib/url";

export const makeTRPCClient = createIsomorphicFn()
  .server(() => {
    return createTRPCClient<Api.AppRouter>({
      links: [
        httpBatchStreamLink({
          transformer: SuperJSON,
          url: getBaseUrl() + "/api/trpc",
          headers() {
            const headers = new Headers(getRequestHeaders() as HeadersInit);
            headers.set("x-trpc-source", "tanstack-start-server");
            return headers;
          },
        }),
      ],
    });
  })
  .client(() => {
    return createTRPCClient<Api.AppRouter>({
      links: [
        loggerLink({
          enabled: (op) =>
            env.NODE_ENV === "development" ||
            (op.direction === "down" && op.result instanceof Error),
        }),
        httpBatchStreamLink({
          transformer: SuperJSON,
          url: getBaseUrl() + "/api/trpc",
          headers() {
            const headers = new Headers();
            headers.set("x-trpc-source", "tanstack-start-client");
            return headers;
          },
        }),
      ],
    });
  });

export const { useTRPC, TRPCProvider } = createTRPCContext<Api.AppRouter>();
