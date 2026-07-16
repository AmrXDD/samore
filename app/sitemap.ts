import type { MetadataRoute } from "next";
import { SITE_URL, allServiceSlugs } from "@/lib/constants";
import { getPublishedCourses } from "@/lib/queries";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes = [
    "",
    "/about",
    "/contact",
    "/courses",
    "/purchase-loi",
    "/privacy-policy",
    "/terms",
  ].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: path === "" ? 1 : 0.7,
  }));

  const serviceRoutes = allServiceSlugs().map((slug) => ({
    url: `${SITE_URL}/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  let courseRoutes: MetadataRoute.Sitemap = [];
  try {
    const courses = await getPublishedCourses();
    courseRoutes = courses.map((c) => ({
      url: `${SITE_URL}/courses/${c.slug}`,
      lastModified: new Date(c.updated_at),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }));
  } catch {
    courseRoutes = [];
  }

  return [...staticRoutes, ...serviceRoutes, ...courseRoutes];
}
