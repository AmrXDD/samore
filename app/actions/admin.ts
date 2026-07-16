"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  courseSchema,
  categorySchema,
  bankSettingsSchema,
  heroSchema,
  companySettingsSchema,
  seoSchema,
} from "@/lib/validations";
import { sendEmail } from "@/lib/email/send";
import PaymentApproved from "@/emails/payment-approved";
import { slugify } from "@/lib/utils";
import { type ActionState, formToObject, validate } from "@/lib/action-state";

async function logActivity(
  actor: string | null,
  action: string,
  entity: string,
  entityId?: string | null,
  meta?: Record<string, unknown>,
) {
  const admin = createAdminClient();
  await admin.from("activity_logs").insert({
    actor,
    action,
    entity,
    entity_id: entityId ?? null,
    meta: meta ?? null,
  });
}

/* ───────────────────────────── Courses ───────────────────────────── */

export async function upsertCourse(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const admin = await requireAdmin();
  const values = formToObject(formData);
  const id = values.id || null;

  const result = validate(courseSchema, values);
  if (!result.success) {
    return { ok: false, message: "Please fix the highlighted fields.", errors: result.errors };
  }
  const c = result.data;
  const supabase = createAdminClient();

  const payload = {
    title: c.title,
    slug: slugify(c.title),
    code: c.code || null,
    description: c.description || null,
    price: c.price,
    currency: c.currency.toUpperCase(),
    duration: c.duration || null,
    instructor: c.instructor || null,
    category_id: c.categoryId || null,
    visibility: c.visibility,
    thumbnail_url: c.thumbnailUrl || null,
  };

  try {
    if (id) {
      const { error } = await supabase.from("courses").update(payload).eq("id", id);
      if (error) throw error;
      await logActivity(admin.email, "course.updated", "courses", id, { title: c.title });
    } else {
      const { data, error } = await supabase
        .from("courses")
        .insert(payload)
        .select("id")
        .single();
      if (error) throw error;
      await logActivity(admin.email, "course.created", "courses", data.id, { title: c.title });
    }
    revalidatePath("/admin/courses");
    revalidatePath("/courses");
    return { ok: true, message: id ? "Course updated." : "Course created." };
  } catch (err) {
    // Surface the real cause — a generic message here just hides the problem.
    const e = err as { code?: string; message?: string; details?: string };
    console.error("upsertCourse failed:", e.code, e.message, e.details);

    if (e.code === "23505") {
      return {
        ok: false,
        message: "A course with this title already exists. Use a different title.",
        errors: { title: ["This title is already taken."] },
      };
    }
    if (e.code === "42703") {
      return {
        ok: false,
        message:
          "Database is out of date (missing a column). Run sql/seed-data.sql in the Supabase SQL editor.",
      };
    }
    if (e.code === "23503") {
      return { ok: false, message: "That category no longer exists. Pick another." };
    }
    return {
      ok: false,
      message: e.message ? `Could not save course: ${e.message}` : "Could not save course.",
    };
  }
}

export async function setCourseVisibility(id: string, visibility: string): Promise<void> {
  const admin = await requireAdmin();
  const supabase = createAdminClient();
  await supabase.from("courses").update({ visibility }).eq("id", id);
  await logActivity(admin.email, "course.visibility", "courses", id, { visibility });
  revalidatePath("/admin/courses");
  revalidatePath("/courses");
}

export async function deleteCourse(id: string): Promise<void> {
  const admin = await requireAdmin();
  const supabase = createAdminClient();
  await supabase.from("courses").delete().eq("id", id);
  await logActivity(admin.email, "course.deleted", "courses", id);
  revalidatePath("/admin/courses");
  revalidatePath("/courses");
}

export async function createCategory(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const admin = await requireAdmin();
  const result = validate(categorySchema, formToObject(formData));
  if (!result.success) {
    return { ok: false, message: "Enter a category name.", errors: result.errors };
  }
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("course_categories")
    .insert({ name: result.data.name, slug: slugify(result.data.name) });
  if (error) return { ok: false, message: "Category already exists or is invalid." };
  await logActivity(admin.email, "category.created", "course_categories", null, {
    name: result.data.name,
  });
  revalidatePath("/admin/courses");
  return { ok: true, message: "Category created." };
}

export async function deleteCategory(id: string): Promise<void> {
  await requireAdmin();
  const supabase = createAdminClient();
  await supabase.from("course_categories").delete().eq("id", id);
  revalidatePath("/admin/courses");
}

/* ───────────────────────────── Payments ───────────────────────────── */

export async function approvePayment(id: string, notes?: string): Promise<void> {
  const admin = await requireAdmin();
  const supabase = createAdminClient();

  const { data: payment } = await supabase
    .from("payments")
    .select("*, course:courses(title)")
    .eq("id", id)
    .single();

  await supabase
    .from("payments")
    .update({ status: "approved", admin_notes: notes ?? null })
    .eq("id", id);

  if (payment?.registration_id) {
    await supabase
      .from("course_registrations")
      .update({ status: "approved" })
      .eq("id", payment.registration_id);
  }

  await logActivity(admin.email, "payment.approved", "payments", id, {
    reference: payment?.reference,
  });

  if (payment?.email) {
    await sendEmail({
      to: payment.email,
      subject: `Payment approved — ${payment.course?.title ?? "SAMORE"}`,
      react: PaymentApproved({
        customerName: payment.customer_name,
        reference: payment.reference,
        courseTitle: payment.course?.title ?? "your course",
      }),
    });
  }

  revalidatePath("/admin/payments");
  revalidatePath("/admin");
}

export async function rejectPayment(id: string, notes?: string): Promise<void> {
  const admin = await requireAdmin();
  const supabase = createAdminClient();

  const { data: payment } = await supabase
    .from("payments")
    .select("reference, registration_id")
    .eq("id", id)
    .single();

  await supabase
    .from("payments")
    .update({ status: "rejected", admin_notes: notes ?? null })
    .eq("id", id);

  if (payment?.registration_id) {
    await supabase
      .from("course_registrations")
      .update({ status: "rejected" })
      .eq("id", payment.registration_id);
  }

  await logActivity(admin.email, "payment.rejected", "payments", id, {
    reference: payment?.reference,
  });
  revalidatePath("/admin/payments");
  revalidatePath("/admin");
}

/* ─────────────────────── Contact messages / LOI ─────────────────────── */

export async function updateContactStatus(id: string, status: string): Promise<void> {
  await requireAdmin();
  const supabase = createAdminClient();
  await supabase.from("contact_messages").update({ status }).eq("id", id);
  revalidatePath("/admin/emails");
}

export async function deleteContactMessage(id: string): Promise<void> {
  const admin = await requireAdmin();
  const supabase = createAdminClient();
  await supabase.from("contact_messages").delete().eq("id", id);
  await logActivity(admin.email, "contact.deleted", "contact_messages", id);
  revalidatePath("/admin/emails");
}

export async function deleteLoi(id: string): Promise<void> {
  const admin = await requireAdmin();
  const supabase = createAdminClient();
  const { data: loi } = await supabase.from("loi").select("pdf_path").eq("id", id).single();
  if (loi?.pdf_path) {
    await supabase.storage.from("loi").remove([loi.pdf_path]);
  }
  await supabase.from("loi").delete().eq("id", id);
  await logActivity(admin.email, "loi.deleted", "loi", id);
  revalidatePath("/admin/loi");
}

/* ───────────────────────────── Settings ───────────────────────────── */

export async function saveBankSettings(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const admin = await requireAdmin();
  const raw = formToObject(formData);
  const parsed = validate(bankSettingsSchema, {
    ...raw,
    isActive: raw.isActive === "on" || raw.isActive === "true",
  });
  if (!parsed.success) {
    return { ok: false, message: "Please fix the highlighted fields.", errors: parsed.errors };
  }
  const b = parsed.data;
  const supabase = createAdminClient();

  const { error } = await supabase.from("bank_settings").upsert(
    {
      id: "00000000-0000-0000-0000-000000000001",
      bank_name: b.bankName || null,
      account_name: b.accountName || null,
      account_number: b.accountNumber || null,
      iban: b.iban || null,
      swift: b.swift || null,
      branch: b.branch || null,
      currency: b.currency,
      instructions: b.instructions || null,
      is_active: b.isActive,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "id" },
  );
  if (error) return { ok: false, message: "Could not save bank details." };
  await logActivity(admin.email, "settings.bank_updated", "bank_settings");
  revalidatePath("/admin/settings");
  return { ok: true, message: "Bank details saved." };
}

export async function saveHero(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const admin = await requireAdmin();
  const parsed = validate(heroSchema, formToObject(formData));
  if (!parsed.success) {
    return { ok: false, message: "Please fix the highlighted fields.", errors: parsed.errors };
  }
  const h = parsed.data;
  const supabase = createAdminClient();
  const { error } = await supabase.from("hero").upsert(
    {
      id: "00000000-0000-0000-0000-000000000001",
      eyebrow: h.eyebrow || null,
      headline: h.headline,
      subheadline: h.subheadline || null,
      cta_label: h.ctaLabel || null,
      cta_href: h.ctaHref || null,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "id" },
  );
  if (error) return { ok: false, message: "Could not save hero." };
  await logActivity(admin.email, "settings.hero_updated", "hero");
  revalidatePath("/admin/settings");
  revalidatePath("/");
  return { ok: true, message: "Homepage hero saved." };
}

export async function saveCompanySettings(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const admin = await requireAdmin();
  const parsed = validate(companySettingsSchema, formToObject(formData));
  if (!parsed.success) {
    return { ok: false, message: "Please fix the highlighted fields.", errors: parsed.errors };
  }
  const supabase = createAdminClient();
  const { error } = await supabase.from("settings").upsert(
    { key: "company", value: parsed.data, updated_at: new Date().toISOString() },
    { onConflict: "key" },
  );
  if (error) return { ok: false, message: "Could not save company details." };
  await logActivity(admin.email, "settings.company_updated", "settings");
  revalidatePath("/admin/settings");
  return { ok: true, message: "Company details saved." };
}

export async function saveSeo(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const admin = await requireAdmin();
  const parsed = validate(seoSchema, formToObject(formData));
  if (!parsed.success) {
    return { ok: false, message: "Please fix the highlighted fields.", errors: parsed.errors };
  }
  const s = parsed.data;
  const supabase = createAdminClient();
  const { error } = await supabase.from("seo").upsert(
    {
      path: s.path,
      title: s.title || null,
      description: s.description || null,
      og_image: s.ogImage || null,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "path" },
  );
  if (error) return { ok: false, message: "Could not save SEO settings." };
  await logActivity(admin.email, "settings.seo_updated", "seo", null, { path: s.path });
  revalidatePath("/admin/settings");
  return { ok: true, message: "SEO settings saved." };
}
