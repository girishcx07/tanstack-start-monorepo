import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { z } from "zod";

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

export const Route = createFileRoute("/register")({
  component: RegisterPage,
});

const RegisterSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

function RegisterPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
    validators: {
      onChange: RegisterSchema,
    },
    onSubmit: async ({ value }) => {
      setIsSubmitting(true);
      try {
        const res = await authClient.signUp.email({
          name: value.name,
          email: value.email,
          password: value.password,
        });

        if (res.error) {
          toast.error(res.error.message ?? "Failed to register");
        } else {
          toast.success("Successfully registered");
          await navigate({ to: "/" });
        }
      } catch {
        toast.error("An unexpected error occurred");
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  return (
    <main className="container flex h-screen items-center justify-center">
      <div className="bg-card w-full max-w-md rounded-xl border p-8 shadow-sm">
        <h1 className="mb-6 text-2xl font-bold">Create an account</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            void form.handleSubmit();
          }}
          className="flex flex-col gap-4"
        >
          <FieldGroup>
            <form.Field
              name="name"
              children={(field) => (
                <Field
                  data-invalid={
                    field.state.meta.isTouched && !field.state.meta.isValid
                  }
                >
                  <FieldContent>
                    <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                  </FieldContent>
                  <Input
                    id={field.name}
                    type="text"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="John Doe"
                  />
                  {field.state.meta.isTouched && !field.state.meta.isValid && (
                    <FieldError errors={field.state.meta.errors} />
                  )}
                </Field>
              )}
            />

            <form.Field
              name="email"
              children={(field) => (
                <Field
                  data-invalid={
                    field.state.meta.isTouched && !field.state.meta.isValid
                  }
                >
                  <FieldContent>
                    <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                  </FieldContent>
                  <Input
                    id={field.name}
                    type="email"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="name@example.com"
                  />
                  {field.state.meta.isTouched && !field.state.meta.isValid && (
                    <FieldError errors={field.state.meta.errors} />
                  )}
                </Field>
              )}
            />

            <form.Field
              name="password"
              children={(field) => (
                <Field
                  data-invalid={
                    field.state.meta.isTouched && !field.state.meta.isValid
                  }
                >
                  <FieldContent>
                    <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                  </FieldContent>
                  <Input
                    id={field.name}
                    type="password"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="••••••••"
                  />
                  {field.state.meta.isTouched && !field.state.meta.isValid && (
                    <FieldError errors={field.state.meta.errors} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Creating account..." : "Sign Up"}
          </Button>

          <p className="text-muted-foreground mt-4 text-center text-sm">
            Already have an account?{" "}
            <Button
              variant="link"
              className="h-auto p-0"
              onClick={() => navigate({ to: "/login" })}
            >
              Sign in
            </Button>
          </p>
        </form>
      </div>
    </main>
  );
}
