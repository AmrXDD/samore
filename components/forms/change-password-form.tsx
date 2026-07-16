"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { changePassword } from "@/app/actions/auth";
import { initialActionState } from "@/lib/action-state";
import { Input } from "@/components/ui/input";
import { Field, SubmitButton } from "./form-primitives";

export function ChangePasswordForm() {
  const [state, formAction] = useActionState(changePassword, initialActionState);

  useEffect(() => {
    if (!state.message) return;
    if (state.ok) toast.success(state.message);
    else if (!state.errors) toast.error(state.message);
  }, [state]);

  return (
    <form action={formAction} className="space-y-5">
      <Field label="New password" htmlFor="password" required error={state.errors?.password}>
        <Input id="password" name="password" type="password" autoComplete="new-password" />
      </Field>
      <Field label="Confirm password" htmlFor="confirm" required error={state.errors?.confirm}>
        <Input id="confirm" name="confirm" type="password" autoComplete="new-password" />
      </Field>
      <SubmitButton className="w-full">Update password</SubmitButton>
    </form>
  );
}
