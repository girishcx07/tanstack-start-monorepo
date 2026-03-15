import { createFileRoute, redirect } from "@tanstack/react-router";

import { CreatePostForm } from "@/components/create-post-form";
import { DashboardHeader } from "@/components/dashboard-header";
import { PostSection } from "@/components/post-section";
import { WelcomeCard } from "@/components/welcome-card";
import { getSession } from "@/lib/auth.functions";

export const Route = createFileRoute("/_protected/dashboard")({
  beforeLoad: async () => {
    const session = await getSession();

    if (!session) {
      // eslint-disable-next-line @typescript-eslint/only-throw-error
      throw redirect({ to: "/login" });
    }

    return { user: session.user };
  },
  component: Dashboard,
});

function Dashboard() {
  const { user } = Route.useRouteContext();

  return (
    <main className="bg-muted/40 min-h-screen px-6 py-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
        <DashboardHeader />

        <WelcomeCard user={user} />

        <div className="grid gap-8 md:grid-cols-3">
          <CreatePostForm />
          <PostSection />
        </div>
      </div>
    </main>
  );
}
