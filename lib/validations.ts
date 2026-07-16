import { z } from "zod";
import { INQUIRY_TYPES } from "@/lib/constants";

const inquiryEnum = z.enum(
  INQUIRY_TYPES as unknown as [string, ...string[]],
);

export const contactSchema = z.object({
  name: z.string().min(2, "Please enter your name.").max(120),
  company: z.string().max(160).optional().or(z.literal("")),
  phone: z
    .string()
    .max(40)
    .regex(/^[+()\-\s\d]*$/, "Enter a valid phone number.")
    .optional()
    .or(z.literal("")),
  email: z.string().email("Enter a valid email."),
  inquiryType: inquiryEnum,
  message: z.string().min(10, "Message must be at least 10 characters.").max(4000),
  // Honeypot — must stay empty.
  website: z.string().max(0).optional().or(z.literal("")),
});
export type ContactInput = z.infer<typeof contactSchema>;

export const newsletterSchema = z.object({
  email: z.string().email("Enter a valid email."),
  website: z.string().max(0).optional().or(z.literal("")),
});
export type NewsletterInput = z.infer<typeof newsletterSchema>;

export const orderSchema = z.object({
  customerName: z.string().min(2, "Please enter your full name.").max(120),
  company: z.string().max(160).optional().or(z.literal("")),
  email: z.string().email("Enter a valid email."),
  phone: z
    .string()
    .min(5, "Enter a valid phone number.")
    .max(40)
    .regex(/^[+()\-\s\d]*$/, "Enter a valid phone number."),
  notes: z.string().max(2000).optional().or(z.literal("")),
  /** JSON array of { courseId, quantity } — prices are re-read server-side. */
  items: z.string().min(2, "Your cart is empty."),
  website: z.string().max(0).optional().or(z.literal("")),
});
export type OrderInput = z.infer<typeof orderSchema>;

export const cartItemSchema = z.object({
  courseId: z.string().uuid(),
  quantity: z.number().int().min(1).max(50),
});

export const receiptSchema = z.object({
  paymentReference: z.string().min(4, "Enter your payment reference."),
});

export const loiSchema = z.object({
  customerName: z.string().min(2, "Please enter your full name.").max(120),
  company: z.string().min(2, "Company name is required.").max(200),
  email: z.string().email("Enter a valid email."),
  phone: z
    .string()
    .min(5, "Enter a valid phone number.")
    .max(40)
    .regex(/^[+()\-\s\d]*$/, "Enter a valid phone number."),
  commodity: z.enum(["Steel", "Oil"]),
  product: z.string().min(2, "Enter the product name.").max(160),
  quantity: z.string().min(1, "Enter the quantity.").max(80),
  monthlyDelivery: z.string().max(80).optional().or(z.literal("")),
  port: z.string().max(120).optional().or(z.literal("")),
  country: z.string().max(120).optional().or(z.literal("")),
  notes: z.string().max(2000).optional().or(z.literal("")),
  website: z.string().max(0).optional().or(z.literal("")),
});
export type LoiInput = z.infer<typeof loiSchema>;

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email."),
  password: z.string().min(1, "Password is required."),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const changePasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Use at least 8 characters.")
      .regex(/[A-Z]/, "Include an uppercase letter.")
      .regex(/[a-z]/, "Include a lowercase letter.")
      .regex(/\d/, "Include a number."),
    confirm: z.string(),
  })
  .refine((v) => v.password === v.confirm, {
    message: "Passwords do not match.",
    path: ["confirm"],
  });
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;

const visibilityEnum = z.enum(["draft", "published", "archived"]);

export const courseSchema = z.object({
  title: z.string().min(2, "Title is required.").max(200),
  code: z.string().max(16).optional().or(z.literal("")),
  description: z.string().max(6000).optional().or(z.literal("")),
  price: z.coerce.number().min(0, "Price cannot be negative."),
  currency: z.string().length(3).default("USD"),
  duration: z.string().max(120).optional().or(z.literal("")),
  instructor: z.string().max(160).optional().or(z.literal("")),
  categoryId: z.string().uuid().optional().or(z.literal("")),
  visibility: visibilityEnum.default("draft"),
  thumbnailUrl: z.string().url().optional().or(z.literal("")),
});
export type CourseInput = z.infer<typeof courseSchema>;

export const categorySchema = z.object({
  name: z.string().min(2, "Category name is required.").max(120),
});

export const bankSettingsSchema = z.object({
  bankName: z.string().max(160).optional().or(z.literal("")),
  accountName: z.string().max(160).optional().or(z.literal("")),
  accountNumber: z.string().max(80).optional().or(z.literal("")),
  iban: z.string().max(80).optional().or(z.literal("")),
  swift: z.string().max(40).optional().or(z.literal("")),
  branch: z.string().max(160).optional().or(z.literal("")),
  currency: z.string().length(3).default("USD"),
  instructions: z.string().max(4000).optional().or(z.literal("")),
  isActive: z.boolean().default(true),
});
export type BankSettingsInput = z.infer<typeof bankSettingsSchema>;

export const heroSchema = z.object({
  eyebrow: z.string().max(120).optional().or(z.literal("")),
  headline: z.string().min(2, "Headline is required.").max(200),
  subheadline: z.string().max(400).optional().or(z.literal("")),
  ctaLabel: z.string().max(60).optional().or(z.literal("")),
  ctaHref: z.string().max(200).optional().or(z.literal("")),
});
export type HeroInput = z.infer<typeof heroSchema>;

export const companySettingsSchema = z.object({
  name: z.string().max(200),
  legalName: z.string().max(300).optional().or(z.literal("")),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().max(40).optional().or(z.literal("")),
  address: z.string().max(400).optional().or(z.literal("")),
  logoUrl: z.string().url().optional().or(z.literal("")),
});
export type CompanySettingsInput = z.infer<typeof companySettingsSchema>;

export const seoSchema = z.object({
  path: z.string().min(1).max(200),
  title: z.string().max(200).optional().or(z.literal("")),
  description: z.string().max(400).optional().or(z.literal("")),
  ogImage: z.string().url().optional().or(z.literal("")),
});
export type SeoInput = z.infer<typeof seoSchema>;
