import { createFileRoute } from "@tanstack/react-router";

import { Button } from "@acme/ui/button";

import { FeatureCard } from "@/components/feature-card";

export const Route = createFileRoute("/")({
  loader: ({ context }) => {
    const { trpc, queryClient } = context;
    void queryClient.prefetchQuery(trpc.post.all.queryOptions());
  },
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <main className="bg-muted/40 flex min-h-screen flex-col items-center px-6 py-24">
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center text-center">
        {/* HERO */}
        <h1 className="max-w-4xl text-5xl font-extrabold tracking-tight sm:text-6xl">
          Build Full-Stack Apps with{" "}
          <span className="text-primary">TanStack Start</span>
        </h1>

        <p className="text-muted-foreground mt-4 max-w-2xl text-lg">
          A production-ready monorepo starter powered by TanStack Start, Hono,
          tRPC, Better Auth, Drizzle ORM and PostgreSQL.
        </p>

        {/* CTA */}
        <div className="mt-8 flex gap-4">
          <Button size="lg">
            <a href="/login">Get Started</a>
          </Button>

          <Button variant="outline" size="lg">
            <a
              href="https://github.com/girishcx07/tanstack-start-monorepo"
              target="_blank"
              rel="noreferrer"
            >
              View on GitHub
            </a>
          </Button>
        </div>

        {/* FEATURES */}
        <div className="mt-20 grid w-full grid-cols-2 gap-6 sm:grid-cols-3">
          <FeatureCard
            title="TanStack Start"
            desc="Modern React SSR framework"
          />
          <FeatureCard title="tRPC" desc="End-to-end type safety" />
          <FeatureCard title="Hono" desc="Ultra-fast API server" />
          <FeatureCard title="Better Auth" desc="Secure authentication" />
          <FeatureCard title="Drizzle ORM" desc="Type-safe SQL ORM" />
          <FeatureCard title="Turborepo" desc="High-performance monorepo" />
        </div>
      </div>
    </main>
  );
}
