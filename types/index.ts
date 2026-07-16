/** Domain types shared across the SAMORE app. Mirrors the SQL schema in sql/schema.sql. */

export type Role = "admin" | "user";

export type Visibility = "draft" | "published" | "archived";

export type PaymentStatus = "pending" | "submitted" | "approved" | "rejected";

export type ContactStatus = "new" | "read" | "archived";

export type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  role: Role;
  must_change_password: boolean;
  created_at: string;
};

export type CourseCategory = {
  id: string;
  name: string;
  slug: string;
  created_at: string;
};

export type Course = {
  id: string;
  title: string;
  slug: string;
  code: string | null;
  description: string | null;
  price: number;
  currency: string;
  thumbnail_url: string | null;
  duration: string | null;
  instructor: string | null;
  category_id: string | null;
  visibility: Visibility;
  created_at: string;
  updated_at: string;
  category?: CourseCategory | null;
};

export type ServiceRecord = {
  id: string;
  slug: string;
  title: string;
  division: string;
  parent_slug: string | null;
  summary: string | null;
  seo_title: string | null;
  seo_description: string | null;
  is_published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type CourseRegistration = {
  id: string;
  course_id: string | null;
  customer_name: string;
  email: string;
  phone: string | null;
  company: string | null;
  status: PaymentStatus;
  created_at: string;
};

export type Payment = {
  id: string;
  reference: string;
  course_id: string | null;
  registration_id: string | null;
  customer_name: string;
  email: string;
  phone: string | null;
  company: string | null;
  amount: number;
  currency: string;
  method: "bank_transfer";
  status: PaymentStatus;
  loi_id: string | null;
  receipt_url: string | null;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
  course?: Course | null;
  items?: PaymentItem[];
};

export type PaymentItem = {
  id: string;
  payment_id: string;
  course_id: string | null;
  title: string;
  code: string | null;
  price: number;
  quantity: number;
};

export type PaymentReceipt = {
  id: string;
  payment_id: string;
  file_url: string;
  file_path: string;
  uploaded_at: string;
};

export type SteelPrice = {
  id: string;
  table_group: string;
  product: string;
  quantity: string;
  price_usd: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type OilPrice = {
  id: string;
  product: string;
  fob_usd: string | null;
  cif_usd: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type BankSettings = {
  id: string;
  bank_name: string | null;
  account_name: string | null;
  account_number: string | null;
  iban: string | null;
  swift: string | null;
  branch: string | null;
  currency: string;
  instructions: string | null;
  is_active: boolean;
  updated_at: string;
};

export type ContactMessage = {
  id: string;
  name: string;
  company: string | null;
  phone: string | null;
  email: string;
  message: string;
  inquiry_type: string;
  status: ContactStatus;
  created_at: string;
};

export type NewsletterSubscriber = {
  id: string;
  email: string;
  created_at: string;
};

export type Loi = {
  id: string;
  reference: string;
  payment_id: string | null;
  customer_name: string;
  company: string | null;
  email: string;
  phone: string | null;
  subject: string;
  quantity: string | null;
  amount: number | null;
  currency: string;
  pdf_url: string | null;
  pdf_path: string | null;
  created_at: string;
};

export type ActivityLog = {
  id: string;
  actor: string | null;
  action: string;
  entity: string | null;
  entity_id: string | null;
  meta: Record<string, unknown> | null;
  created_at: string;
};

export type HeroContent = {
  id: string;
  eyebrow: string | null;
  headline: string;
  subheadline: string | null;
  cta_label: string | null;
  cta_href: string | null;
  updated_at: string;
};

export type SeoRecord = {
  id: string;
  path: string;
  title: string | null;
  description: string | null;
  og_image: string | null;
  updated_at: string;
};

export type SettingRecord = {
  key: string;
  value: Record<string, unknown> | null;
  updated_at: string;
};

export type MediaAsset = {
  id: string;
  bucket: string;
  path: string;
  url: string;
  kind: string | null;
  alt: string | null;
  created_at: string;
};

export type DashboardStats = {
  total_sales: number;
  total_courses: number;
  total_emails: number;
  total_loi: number;
  pending_payments: number;
  approved_payments: number;
  total_customers: number;
  total_messages: number;
};
