import { createFileRoute } from "@tanstack/react-router";

import { AuthShowcase } from "@/component/auth-showcase";

export const Route = createFileRoute("/")({
  loader: ({ context }) => {
    const { trpc, queryClient } = context;
    void queryClient.prefetchQuery(trpc.post.all.queryOptions());
  },
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <main className="container h-screen py-16">
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          Create <span className="text-primary">Tanstack turbo repo</span> Turbo
        </h1>
        <AuthShowcase />
      </div>
    </main>
  );
}
