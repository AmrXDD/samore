import "server-only";
import { Resend } from "resend";
import type { ReactElement } from "react";

const apiKey = process.env.RESEND_API_KEY;
const from = process.env.EMAIL_FROM || "SAMORE <no-reply@samore-eng.com>";
const internalTo = process.env.EMAIL_TO || "SAMORE2021@gmail.com";

const resend = apiKey ? new Resend(apiKey) : null;

type SendArgs = {
  to: string | string[];
  subject: string;
  react: ReactElement;
  replyTo?: string;
};

/**
 * Sends an email through Resend. If RESEND_API_KEY is not configured the call
 * is a safe no-op (logged), so the app builds and runs without email set up.
 */
export async function sendEmail({ to, subject, react, replyTo }: SendArgs): Promise<
  { ok: true; id?: string } | { ok: false; error: string }
> {
  if (!resend) {
    console.info(`[email] skipped (no RESEND_API_KEY) → "${subject}" to ${String(to)}`);
    return { ok: true };
  }
  try {
    const { data, error } = await resend.emails.send({
      from,
      to,
      subject,
      react,
      replyTo,
    });
    if (error) return { ok: false, error: error.message };
    return { ok: true, id: data?.id };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Email failed" };
  }
}

export const EMAIL_INTERNAL_TO = internalTo;
