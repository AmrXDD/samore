import type { Metadata } from "next";
import Link from "next/link";
import { Clock, User } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { Section } from "@/components/site/section";
import { Reveal } from "@/components/site/reveal";
import { Badge } from "@/components/ui/badge";
import { CourseActions } from "@/components/cart/course-actions";
import { formatCurrency } from "@/lib/utils";
import { getPublishedCourses, isSupabaseConfigured } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Courses",
  description:
    "Enroll in SAMORE professional engineering courses — planning, claims, contracts, value engineering and more. Payment by bank transfer.",
  alternates: { canonical: "/courses" },
};

export const revalidate = 60;

export default async function CoursesPage() {
  const courses = await getPublishedCourses();
  const configured = isSupabaseConfigured();

  return (
    <>
      <PageHero
        eyebrow="Courses"
        title="Professional engineering courses."
        lede="Live, instructor-led courses for engineers, students, Master's and PhD candidates. Enroll and pay securely by bank transfer."
      />

      <Section>
        {courses.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border bg-card py-24 text-center">
            <p className="text-lg font-medium">No courses available.</p>
            <p className="mt-2 text-sm text-muted-foreground">
              New courses are added regularly. In the meantime, explore our{" "}
              <Link href="/engineering-courses" className="underline underline-offset-4">
                full course catalogue
              </Link>{" "}
              or <Link href="/contact" className="underline underline-offset-4">contact us</Link>.
            </p>

            {/* Setup hint — development only, never shown to the public. */}
            {process.env.NODE_ENV !== "production" ? (
              <div className="mx-auto mt-8 max-w-md rounded-lg border border-amber-500/40 bg-amber-50 p-4 text-left">
                <p className="text-xs font-semibold uppercase tracking-wider text-amber-700">
                  Setup required (dev only)
                </p>
                <p className="mt-2 text-sm text-amber-900">
                  {!configured
                    ? "Supabase is not connected. Fill in .env.local, then run: npm run check"
                    : "Connected, but no published courses found. Run sql/seed-data.sql in the Supabase SQL editor to load all 22 courses."}
                </p>
              </div>
            ) : null}
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course, i) => (
              <Reveal key={course.id} delay={i * 0.04}>
                <div className="group flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card transition-colors hover:border-ink">
                  <Link href={`/courses/${course.slug}`} className="block">
                    <div className="aspect-[16/10] w-full overflow-hidden bg-secondary">
                      {course.thumbnail_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={course.thumbnail_url}
                          alt={course.title}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-3xl font-semibold tracking-[0.3em] text-muted-foreground/40">
                          SAMORE
                        </div>
                      )}
                    </div>
                  </Link>

                  <div className="flex flex-1 flex-col p-6">
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                      {course.code ? (
                        <Badge variant="secondary" className="font-mono">
                          {course.code}
                        </Badge>
                      ) : null}
                      {course.category?.name ? (
                        <Badge variant="outline">{course.category.name}</Badge>
                      ) : null}
                    </div>

                    <Link href={`/courses/${course.slug}`}>
                      <h3 className="text-base font-semibold leading-snug tracking-tight hover:underline underline-offset-4">
                        {course.title}
                      </h3>
                    </Link>

                    {course.description ? (
                      <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                        {course.description}
                      </p>
                    ) : null}

                    <div className="mt-4 flex flex-wrap gap-4 text-xs text-muted-foreground">
                      {course.duration ? (
                        <span className="inline-flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5" /> {course.duration}
                        </span>
                      ) : null}
                      {course.instructor ? (
                        <span className="inline-flex items-center gap-1.5">
                          <User className="h-3.5 w-3.5" /> {course.instructor}
                        </span>
                      ) : null}
                    </div>

                    <div className="mt-auto pt-6">
                      <div className="mb-4 flex items-baseline justify-between border-t border-border pt-4">
                        <span className="text-xl font-semibold tracking-tight">
                          {formatCurrency(course.price, course.currency)}
                        </span>
                        <span className="text-xs text-muted-foreground">USD</span>
                      </div>
                      <CourseActions
                        compact
                        item={{
                          courseId: course.id,
                          slug: course.slug,
                          title: course.title,
                          code: course.code,
                          price: course.price,
                          currency: course.currency,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        )}
      </Section>
    </>
  );
}
