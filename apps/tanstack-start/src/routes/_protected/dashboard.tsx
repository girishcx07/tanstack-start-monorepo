import type { User } from "better-auth";
import { Suspense } from "react";
import { useForm } from "@tanstack/react-form";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";

import type { RouterOutputs } from "@acme/api";
import { CreatePostSchema } from "@acme/db/schema";
import { Button } from "@acme/ui/button";
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@acme/ui/field";
import { Input } from "@acme/ui/input";
import { toast } from "@acme/ui/toast";

import { authClient } from "@/auth/client";
import { getSession } from "@/lib/auth.functions";
import { useTRPC } from "@/lib/trpc";

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
    <div className="bg-muted/40 flex min-h-screen w-full justify-center p-8">
      <div className="flex w-full max-w-5xl flex-col gap-8">
        <WelcomeCard user={user} />

        <div className="flex gap-8">
          <div className="w-1/3">
            <CreatePostForm />
          </div>
          <div className="w-2/3">
            <Suspense
              fallback={
                <div className="flex flex-col gap-4">
                  <PostCardSkeleton />
                  <PostCardSkeleton />
                  <PostCardSkeleton />
                </div>
              }
            >
              <PostList />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}

const WelcomeCard = ({ user }: { user: User }) => {
  const navigate = useNavigate();

  return (
    <div className="relative overflow-hidden rounded-2xl border bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-8 text-white shadow-xl">
      <div className="relative z-10 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {user.name}</h1>
          <p className="mt-2 text-white/80">
            Manage your posts and explore the dashboard
          </p>
        </div>

        <Button
          variant="secondary"
          className="bg-white/20 text-white backdrop-blur hover:bg-white/30"
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

      <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
    </div>
  );
};
function CreatePostForm() {
  const trpc = useTRPC();

  const queryClient = useQueryClient();
  const createPost = useMutation(
    trpc.post.create.mutationOptions({
      onSuccess: async () => {
        form.reset();
        await queryClient.invalidateQueries(trpc.post.pathFilter());
      },
      onError: (err) => {
        toast.error(
          err.data?.code === "UNAUTHORIZED"
            ? "You must be logged in to post"
            : "Failed to create post",
        );
      },
    }),
  );

  const form = useForm({
    defaultValues: {
      content: "",
      title: "",
    },
    validators: {
      onSubmit: CreatePostSchema,
    },
    onSubmit: (data) => createPost.mutate(data.value),
  });

  return (
    <form
      className="bg-card rounded-xl border p-6 shadow-sm"
      onSubmit={(event) => {
        event.preventDefault();
        void form.handleSubmit();
      }}
    >
      <h2 className="mb-6 text-xl font-semibold">Create New Post</h2>
      <FieldGroup>
        <form.Field
          name="title"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldContent>
                  <FieldLabel htmlFor={field.name}>Bug Title</FieldLabel>
                </FieldContent>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                  placeholder="Title"
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        />
        <form.Field
          name="content"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldContent>
                  <FieldLabel htmlFor={field.name}>Content</FieldLabel>
                </FieldContent>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                  placeholder="Content"
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        />
      </FieldGroup>
      <div className="mt-6">
        <Button type="submit" className="w-full">
          Create Post
        </Button>
      </div>
    </form>
  );
}

function PostList() {
  const trpc = useTRPC();
  const { data: posts } = useSuspenseQuery(trpc.post.all.queryOptions());

  if (posts.length === 0) {
    return (
      <div className="bg-card rounded-xl border p-12 text-center shadow-sm">
        <p className="text-muted-foreground text-lg font-medium">
          No posts yet
        </p>
        <p className="text-muted-foreground mt-2 text-sm">
          Create your first post above
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {posts.map((p) => (
        <PostCard key={p.id} post={p} />
      ))}
    </div>
  );
}

function PostCard(props: { post: RouterOutputs["post"]["all"][number] }) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const deletePost = useMutation(
    trpc.post.delete.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.post.pathFilter());
      },
    }),
  );

  return (
    <div className="group bg-card flex items-start justify-between rounded-xl border p-6 shadow-sm transition hover:shadow-md">
      <div>
        <h3 className="text-lg font-semibold">{props.post.title}</h3>
        <p className="text-muted-foreground mt-2 text-sm">
          {props.post.content}
        </p>
      </div>

      <Button
        variant="ghost"
        className="text-destructive opacity-0 transition group-hover:opacity-100"
        onClick={() => deletePost.mutate(props.post.id)}
      >
        Delete
      </Button>
    </div>
  );
}

function PostCardSkeleton() {
  return (
    <div className="bg-card flex flex-col gap-2 rounded-xl border p-6">
      <div className="bg-muted h-5 w-1/3 animate-pulse rounded" />
      <div className="bg-muted h-4 w-1/2 animate-pulse rounded" />
    </div>
  );
}
