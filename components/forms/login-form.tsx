"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { login } from "@/app/actions/auth";
import { initialActionState } from "@/lib/action-state";
import { Input } from "@/components/ui/input";
import { Field, SubmitButton } from "./form-primitives";

export function LoginForm() {
  const [state, formAction] = useActionState(login, initialActionState);

  useEffect(() => {
    if (state.message && !state.ok && !state.errors) toast.error(state.message);
  }, [state]);

  return (
    <form action={formAction} className="space-y-5">
      <Field label="Email" htmlFor="email" required error={state.errors?.email}>
        <Input id="email" name="email" type="email" autoComplete="email" placeholder="admin@samore.com" />
      </Field>
      <Field label="Password" htmlFor="password" required error={state.errors?.password}>
        <Input id="password" name="password" type="password" autoComplete="current-password" placeholder="••••••••" />
      </Field>
      <SubmitButton className="w-full">Sign in</SubmitButton>
    </form>
  );
}
