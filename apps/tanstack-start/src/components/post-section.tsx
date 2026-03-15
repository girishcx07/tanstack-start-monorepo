import { Suspense } from "react";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";

import type { RouterOutputs } from "@acme/api";
import { Button } from "@acme/ui/button";

import { useTRPC } from "@/lib/trpc";

export function PostSection() {
  return (
    <div className="col-span-2 flex flex-col gap-4">
      <h2 className="text-lg font-semibold">Posts</h2>

      <Suspense
        fallback={
          <>
            <PostCardSkeleton />
            <PostCardSkeleton />
            <PostCardSkeleton />
          </>
        }
      >
        <PostList />
      </Suspense>
    </div>
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
    <div className="group bg-card flex items-start justify-between rounded-xl border p-5 transition hover:shadow-md">
      <div>
        <h3 className="font-semibold">{props.post.title}</h3>
        <p className="text-muted-foreground mt-1 text-sm">
          {props.post.content}
        </p>
      </div>

      <Button
        size="sm"
        variant="ghost"
        className="opacity-0 transition group-hover:opacity-100"
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
