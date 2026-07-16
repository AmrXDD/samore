import { CourseManager } from "@/components/admin/course-manager";
import { getAllCourses, getCategories } from "@/lib/queries";

export default async function AdminCoursesPage() {
  const [courses, categories] = await Promise.all([getAllCourses(), getCategories()]);
  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Create, edit, publish and archive courses. Published courses appear on the public
        Courses page for bank-transfer enrollment.
      </p>
      <CourseManager courses={courses} categories={categories} />
    </div>
  );
}
