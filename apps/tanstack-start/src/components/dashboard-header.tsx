import { useNavigate } from "@tanstack/react-router";

import { Button } from "@acme/ui/button";

import { authClient } from "@/auth/client";

export function DashboardHeader() {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>

      <Button
        variant="outline"
        onClick={async () => {
          const { data } = await authClient.signOut();
          if (data?.success) {
            await navigate({ to: "/login" });
          }
        }}
      >
        Logout
      </Button>
    </div>
  );
}
