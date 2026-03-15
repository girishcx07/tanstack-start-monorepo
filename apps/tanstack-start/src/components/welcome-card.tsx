import type { User } from "better-auth";

export const WelcomeCard = ({ user }: { user: User }) => {
  return (
    <div className="bg-card rounded-xl border p-6 shadow-sm">
      <h2 className="text-xl font-semibold">Welcome back, {user.name}</h2>

      <p className="text-muted-foreground mt-2 text-sm">
        Manage your posts and explore the dashboard.
      </p>
    </div>
  );
};
