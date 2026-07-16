import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Clock, User, Tag } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { Section } from "@/components/site/section";
import { Badge } from "@/components/ui/badge";
import { CourseActions } from "@/components/cart/course-actions";
import { getCourseBySlug, getBankSettings } from "@/lib/queries";
import { formatCurrency } from "@/lib/utils";
import { SITE_URL } from "@/lib/constants";

export const revalidate = 60;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);
  if (!course) return { title: "Course" };
  return {
    title: course.title,
    description: course.description ?? `Enroll in ${course.title} with SAMORE.`,
    alternates: { canonical: `/courses/${slug}` },
  };
}

export default async function CourseDetailPage({ params }: Props) {
  const { slug } = await params;
  const [course, bank] = await Promise.all([getCourseBySlug(slug), getBankSettings()]);
  if (!course) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: course.title,
    description: course.description ?? undefined,
    provider: { "@type": "Organization", name: "SAMORE", url: SITE_URL },
    offers: {
      "@type": "Offer",
      price: course.price,
      priceCurrency: course.currency,
      availability: "https://schema.org/InStock",
      category: "BankTransfer",
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PageHero
        eyebrow="Course"
        title={course.title}
        crumbs={[{ title: "Courses", href: "/courses" }]}
      />

      <Section>
        <div className="grid gap-16 lg:grid-cols-[1.3fr_1fr]">
          <div>
            {course.thumbnail_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={course.thumbnail_url}
                alt={course.title}
                className="mb-10 aspect-[16/9] w-full rounded-lg border border-border object-cover"
              />
            ) : null}

            <div className="mb-8 flex flex-wrap gap-6 text-sm text-muted-foreground">
              {course.category?.name ? (
                <span className="inline-flex items-center gap-2">
                  <Tag className="h-4 w-4" /> {course.category.name}
                </span>
              ) : null}
              {course.duration ? (
                <span className="inline-flex items-center gap-2">
                  <Clock className="h-4 w-4" /> {course.duration}
                </span>
              ) : null}
              {course.instructor ? (
                <span className="inline-flex items-center gap-2">
                  <User className="h-4 w-4" /> {course.instructor}
                </span>
              ) : null}
            </div>

            <div className="space-y-4 text-lg leading-relaxed text-foreground/90">
              {(course.description ?? "").split("\n").filter(Boolean).map((p, i) => (
                <p key={i}>{p}</p>
              ))}
              {!course.description ? (
                <p className="text-muted-foreground">
                  A professional SAMORE course. Enroll to secure your place.
                </p>
              ) : null}
            </div>
          </div>

          <div className="lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-lg border border-border bg-card p-6">
              <div className="mb-5 flex items-baseline justify-between">
                <span className="text-3xl font-semibold tracking-tighter">
                  {formatCurrency(course.price, course.currency)}
                </span>
                <Badge variant="secondary">Bank transfer</Badge>
              </div>

              <CourseActions
                item={{
                  courseId: course.id,
                  slug: course.slug,
                  title: course.title,
                  code: course.code,
                  price: course.price,
                  currency: course.currency,
                }}
              />

              <ul className="mt-6 space-y-2 border-t border-border pt-5 text-xs text-muted-foreground">
                <li>· Price in USD. Payment by bank transfer only.</li>
                <li>· A Letter of Intent is generated at checkout.</li>
                <li>· Access is unlocked once your transfer is verified.</li>
                {bank?.bank_name ? <li>· Transfers to {bank.bank_name}.</li> : null}
              </ul>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
