/**
 * Datasets available for CSV import/export in the admin panel.
 * Shared by the export route, the import action and the admin UI —
 * only plain data here, safe to import from client components.
 */

export type ColumnType = "text" | "number" | "int" | "bool" | "uuid" | "enum" | "timestamp" | "json";

export type ColumnDef = {
  name: string;
  type: ColumnType;
  /** Must be present and non-empty on import. */
  required?: boolean;
  /** Allowed values for enum columns. */
  values?: readonly string[];
  /** Exported but ignored on import. */
  readOnly?: boolean;
  /** Value used when the cell is empty (for NOT NULL columns with a default). */
  default?: string | number | boolean;
};

export type Dataset = {
  key: string;
  label: string;
  description: string;
  table: string;
  orderBy: { column: string; ascending: boolean };
  columns: ColumnDef[];
  importable: boolean;
  /** Natural unique key used to match rows that have no id (e.g. slug). */
  matchOn?: string;
};

const ts = (name: string): ColumnDef => ({ name, type: "timestamp", readOnly: true });
const id: ColumnDef = { name: "id", type: "uuid" };

export const DATASETS: Dataset[] = [
  {
    key: "courses",
    label: "Courses",
    description: "Course catalogue. Rows are matched by id, then by slug.",
    table: "courses",
    orderBy: { column: "created_at", ascending: false },
    importable: true,
    matchOn: "slug",
    columns: [
      id,
      { name: "title", type: "text", required: true },
      { name: "slug", type: "text" },
      { name: "code", type: "text" },
      { name: "description", type: "text" },
      { name: "price", type: "number", default: 0 },
      { name: "currency", type: "text", default: "USD" },
      { name: "thumbnail_url", type: "text" },
      { name: "duration", type: "text" },
      { name: "instructor", type: "text" },
      { name: "category_id", type: "uuid" },
      { name: "visibility", type: "enum", values: ["draft", "published", "archived"], default: "draft" },
      ts("created_at"),
      ts("updated_at"),
    ],
  },
  {
    key: "course_categories",
    label: "Course categories",
    description: "Categories used to group courses. Matched by id, then by slug.",
    table: "course_categories",
    orderBy: { column: "name", ascending: true },
    importable: true,
    matchOn: "slug",
    columns: [
      id,
      { name: "name", type: "text", required: true },
      { name: "slug", type: "text" },
      ts("created_at"),
    ],
  },
  {
    key: "services",
    label: "Services",
    description: "Company service hierarchy. Matched by id, then by slug.",
    table: "services",
    orderBy: { column: "sort_order", ascending: true },
    importable: true,
    matchOn: "slug",
    columns: [
      id,
      { name: "slug", type: "text", required: true },
      { name: "title", type: "text", required: true },
      { name: "division", type: "text", required: true },
      { name: "parent_slug", type: "text" },
      { name: "summary", type: "text" },
      { name: "seo_title", type: "text" },
      { name: "seo_description", type: "text" },
      { name: "is_published", type: "bool", default: true },
      { name: "sort_order", type: "int", default: 0 },
      ts("created_at"),
      ts("updated_at"),
    ],
  },
  {
    key: "steel_prices",
    label: "Steel prices",
    description: "Steel trading price table. Rows without an id are added as new.",
    table: "steel_prices",
    orderBy: { column: "sort_order", ascending: true },
    importable: true,
    columns: [
      id,
      { name: "table_group", type: "text", default: "Main Prices" },
      { name: "product", type: "text", required: true },
      { name: "quantity", type: "text", required: true },
      { name: "price_usd", type: "text", required: true },
      { name: "sort_order", type: "int", default: 0 },
      { name: "is_active", type: "bool", default: true },
      ts("created_at"),
      ts("updated_at"),
    ],
  },
  {
    key: "oil_prices",
    label: "Oil prices",
    description: "Oil trading price table. Rows without an id are added as new.",
    table: "oil_prices",
    orderBy: { column: "sort_order", ascending: true },
    importable: true,
    columns: [
      id,
      { name: "product", type: "text", required: true },
      { name: "fob_usd", type: "text" },
      { name: "cif_usd", type: "text" },
      { name: "sort_order", type: "int", default: 0 },
      { name: "is_active", type: "bool", default: true },
      ts("created_at"),
      ts("updated_at"),
    ],
  },
  {
    key: "newsletter",
    label: "Newsletter subscribers",
    description: "Subscriber emails. Matched by email, so re-importing never duplicates.",
    table: "newsletter",
    orderBy: { column: "created_at", ascending: false },
    importable: true,
    matchOn: "email",
    columns: [id, { name: "email", type: "text", required: true }, ts("created_at")],
  },
  {
    key: "payments",
    label: "Payments / orders",
    description: "All course orders with status and amounts. Export only.",
    table: "payments",
    orderBy: { column: "created_at", ascending: false },
    importable: false,
    columns: [
      id,
      { name: "reference", type: "text" },
      { name: "customer_name", type: "text" },
      { name: "email", type: "text" },
      { name: "phone", type: "text" },
      { name: "company", type: "text" },
      { name: "amount", type: "number" },
      { name: "currency", type: "text" },
      { name: "method", type: "text" },
      { name: "status", type: "text" },
      { name: "course_id", type: "uuid" },
      { name: "loi_id", type: "uuid" },
      { name: "receipt_url", type: "text" },
      { name: "admin_notes", type: "text" },
      ts("created_at"),
      ts("updated_at"),
    ],
  },
  {
    key: "payment_items",
    label: "Order line items",
    description: "One row per course in each order. Export only.",
    table: "payment_items",
    orderBy: { column: "created_at", ascending: false },
    importable: false,
    columns: [
      id,
      { name: "payment_id", type: "uuid" },
      { name: "course_id", type: "uuid" },
      { name: "title", type: "text" },
      { name: "code", type: "text" },
      { name: "price", type: "number" },
      { name: "quantity", type: "int" },
      ts("created_at"),
    ],
  },
  {
    key: "contact_messages",
    label: "Contact messages",
    description: "Enquiries from the contact form. Export only.",
    table: "contact_messages",
    orderBy: { column: "created_at", ascending: false },
    importable: false,
    columns: [
      id,
      { name: "name", type: "text" },
      { name: "company", type: "text" },
      { name: "phone", type: "text" },
      { name: "email", type: "text" },
      { name: "inquiry_type", type: "text" },
      { name: "message", type: "text" },
      { name: "status", type: "text" },
      ts("created_at"),
    ],
  },
  {
    key: "loi",
    label: "Letters of Intent",
    description: "Generated LOIs (PDF links included). Export only.",
    table: "loi",
    orderBy: { column: "created_at", ascending: false },
    importable: false,
    columns: [
      id,
      { name: "reference", type: "text" },
      { name: "customer_name", type: "text" },
      { name: "company", type: "text" },
      { name: "email", type: "text" },
      { name: "phone", type: "text" },
      { name: "subject", type: "text" },
      { name: "quantity", type: "text" },
      { name: "amount", type: "number" },
      { name: "currency", type: "text" },
      { name: "payment_id", type: "uuid" },
      { name: "pdf_url", type: "text" },
      ts("created_at"),
    ],
  },
  {
    key: "activity_logs",
    label: "Activity log",
    description: "Audit trail of admin actions. Export only.",
    table: "activity_logs",
    orderBy: { column: "created_at", ascending: false },
    importable: false,
    columns: [
      id,
      { name: "actor", type: "text" },
      { name: "action", type: "text" },
      { name: "entity", type: "text" },
      { name: "entity_id", type: "uuid" },
      { name: "meta", type: "json" },
      ts("created_at"),
    ],
  },
];

export function getDataset(key: string): Dataset | undefined {
  return DATASETS.find((d) => d.key === key);
}
