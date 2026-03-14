import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

import { getSession } from "@/lib/auth.functions";

export const Route = createFileRoute("/_protected")({
  beforeLoad: async ({ location }) => {
    const session = await getSession();

    if (!session) {
      const error = new Error("Redirecting to login");
      Object.assign(
        error,
        redirect({
          to: "/login",
          search: { redirect: location.href },
        }),
      );
      throw error;
    }

    return { user: session.user };
  },
  component: () => <Outlet />,
});
