import { z } from "zod";

export type FieldErrors = Record<string, string[] | undefined>;

export type ActionState = {
  ok: boolean;
  message: string;
  errors?: FieldErrors;
  /** Optional payload (e.g. a reference, redirect target, or created id). */
  data?: Record<string, unknown>;
};

export const initialActionState: ActionState = { ok: false, message: "" };

/** Validate a Zod schema against a FormData-derived object. */
export function validate<T extends z.ZodTypeAny>(
  schema: T,
  values: unknown,
):
  | { success: true; data: z.infer<T> }
  | { success: false; errors: FieldErrors } {
  const parsed = schema.safeParse(values);
  if (parsed.success) return { success: true, data: parsed.data };
  return { success: false, errors: parsed.error.flatten().fieldErrors };
}

export function formToObject(formData: FormData): Record<string, string> {
  const obj: Record<string, string> = {};
  for (const [key, value] of formData.entries()) {
    if (typeof value === "string") obj[key] = value;
  }
  return obj;
}
