/**
 * SAMORE — canonical company facts and the site's information architecture.
 *
 * Every value here is sourced from the official SAMORE company material
 * (company hierarchy chart + service documents). The hierarchy below is a
 * 1:1 replica of the company chart and is the single source of truth for
 * navigation, the homepage tree, and routing. No service is added or removed.
 */

export const COMPANY = {
  name: "SAMORE",
  legalName:
    "SAMORE Engineering Construction Agriculture Industry and Trade Limited Company",
  tagline: "Engineering services and Steel & Oil Trading",
  slogan: "At the crossroads of innovation and tradition.",
  description:
    "SAMORE delivers excellence in engineering services alongside best-price steel and oil trading — a partner in success across construction technical support, conflict resolution, value engineering and engineering education.",
  phone: "+965-66259917",
  phoneHref: "tel:+96566259917",
  email: "SAMORE2021@gmail.com",
  emailHref: "mailto:SAMORE2021@gmail.com",
  salesEmail: "sales@samore-eng.com",
  contactPerson: "Eng. Sameh Ibrahim",
  domain: "samore-eng.com",
} as const;

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "http://localhost:3000";

export type NavLeaf = {
  title: string;
  slug: string;
};

export type NavCategory = {
  title: string;
  slug: string;
  children: NavLeaf[];
};

export type NavDivision = {
  title: string;
  slug: string;
  children: NavCategory[];
};

/**
 * The SAMORE company hierarchy — replicated exactly from the company chart.
 *
 *   SAMORE
 *   ├── Engineering & Construction
 *   │   ├── Project Technical Support
 *   │   │   ├── Project Planning
 *   │   │   ├── Project Control Systems
 *   │   │   └── Value Engineering
 *   │   ├── Construction Conflict Solutions
 *   │   │   ├── Project Claims
 *   │   │   ├── Court Expert Engineer
 *   │   │   └── Project Claim Guarding
 *   │   └── Engineering Education
 *   │       ├── Engineering Education
 *   │       ├── Engineering Courses
 *   │       └── On Job Assist
 *   └── Steel & Oil Trading
 *       ├── Steel Trading
 *       └── Oil Trading
 */
export const HIERARCHY: NavDivision[] = [
  {
    title: "Engineering & Construction",
    slug: "engineering-construction",
    children: [
      {
        title: "Project Technical Support",
        slug: "project-technical-support",
        children: [
          { title: "Project Planning", slug: "project-planning" },
          { title: "Project Control Systems", slug: "project-control-systems" },
          { title: "Value Engineering", slug: "value-engineering" },
        ],
      },
      {
        title: "Construction Conflict Solutions",
        slug: "construction-conflict-solutions",
        children: [
          { title: "Project Claims", slug: "project-claims" },
          { title: "Court Expert Engineer", slug: "court-expert-engineer" },
          { title: "Project Claim Guarding", slug: "project-claim-guarding" },
        ],
      },
      {
        title: "Engineering Education",
        slug: "engineering-education",
        children: [
          { title: "Engineering Education", slug: "engineering-education" },
          { title: "Engineering Courses", slug: "engineering-courses" },
          { title: "On Job Assist", slug: "on-job-assist" },
        ],
      },
    ],
  },
  {
    title: "Steel & Oil Trading",
    slug: "steel-oil-trading",
    children: [
      {
        title: "Steel Trading",
        slug: "steel-trading",
        children: [{ title: "Steel Trading", slug: "steel-trading" }],
      },
      {
        title: "Oil Trading",
        slug: "oil-trading",
        children: [{ title: "Oil Trading", slug: "oil-trading" }],
      },
    ],
  },
];

/** Flat list of every service slug that must have a page. */
export function allServiceSlugs(): string[] {
  const set = new Set<string>();
  for (const division of HIERARCHY) {
    set.add(division.slug);
    for (const category of division.children) {
      set.add(category.slug);
      for (const leaf of category.children) {
        set.add(leaf.slug);
      }
    }
  }
  return [...set];
}

export const INQUIRY_TYPES = [
  "General Inquiry",
  "Engineering & Construction",
  "Project Technical Support",
  "Construction Conflict Solutions",
  "Engineering Education",
  "Steel Trading",
  "Oil Trading",
  "Course Enrollment",
  "Partnership",
] as const;

export type InquiryType = (typeof INQUIRY_TYPES)[number];

export const COURSE_CATEGORIES = [
  "Planning",
  "Claims",
  "Contracts",
  "Value Engineering",
  "Project Control",
  "Arbitration",
  "General",
] as const;

export const NAV_LINKS = [
  { title: "About", href: "/about" },
  { title: "Engineering & Construction", href: "/engineering-construction" },
  { title: "Steel & Oil Trading", href: "/steel-oil-trading" },
  { title: "Courses", href: "/courses" },
  { title: "Contact", href: "/contact" },
] as const;

export const PAYMENT_STATUSES = [
  "pending",
  "submitted",
  "approved",
  "rejected",
] as const;
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];
