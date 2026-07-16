"use client";

import { useActionState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { ArrowRight } from "lucide-react";
import { subscribeNewsletter } from "@/app/actions/newsletter";
import { initialActionState } from "@/lib/action-state";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "./form-primitives";

export function NewsletterForm() {
  const [state, formAction] = useActionState(subscribeNewsletter, initialActionState);
  const ref = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!state.message) return;
    if (state.ok) {
      toast.success(state.message);
      ref.current?.reset();
    } else {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <form ref={ref} action={formAction} className="relative flex items-center gap-2">
      <div className="absolute left-[-9999px]" aria-hidden>
        <input name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <Input
        name="email"
        type="email"
        required
        placeholder="Email address"
        aria-label="Email address"
        className="h-11"
      />
      <SubmitButton size="icon" className="shrink-0">
        <ArrowRight className="h-4 w-4" />
      </SubmitButton>
    </form>
  );
}
