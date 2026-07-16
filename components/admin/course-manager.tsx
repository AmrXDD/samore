"use client";

import { useActionState, useEffect, useRef, useState, useTransition } from "react";
import { toast } from "sonner";
import { MoreHorizontal, Pencil, Plus, Trash2, Eye, EyeOff, Archive } from "lucide-react";
import {
  upsertCourse,
  setCourseVisibility,
  deleteCourse,
  createCategory,
  deleteCategory,
} from "@/app/actions/admin";
import { initialActionState } from "@/lib/action-state";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/admin/status-badge";
import { ConfirmDelete } from "@/components/ui/confirm-delete";
import { Field, SubmitButton } from "@/components/forms/form-primitives";
import type { Course, CourseCategory } from "@/types";

export function CourseManager({
  courses,
  categories,
}: {
  courses: Course[];
  categories: CourseCategory[];
}) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Course | null>(null);
  const [deleting, setDeleting] = useState<Course | null>(null);
  const [pending, startTransition] = useTransition();

  const [state, action] = useActionState(upsertCourse, initialActionState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.ok && state.message) {
      toast.success(state.message);
      setOpen(false);
      setEditing(null);
      formRef.current?.reset();
    } else if (state.message && !state.ok && !state.errors) {
      toast.error(state.message);
    }
  }, [state]);

  function openCreate() {
    setEditing(null);
    setOpen(true);
  }
  function openEdit(course: Course) {
    setEditing(course);
    setOpen(true);
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <CategoryManager categories={categories} pending={pending} startTransition={startTransition} />
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreate}>
              <Plus className="h-4 w-4" /> New course
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editing ? "Edit course" : "Create course"}</DialogTitle>
            </DialogHeader>
            <form ref={formRef} action={action} className="space-y-5 pt-2">
              {editing ? <input type="hidden" name="id" value={editing.id} /> : null}
              <div className="grid gap-5 sm:grid-cols-[1fr_140px]">
                <Field label="Title" htmlFor="title" required error={state.errors?.title}>
                  <Input id="title" name="title" defaultValue={editing?.title} required />
                </Field>
                <Field label="Code" htmlFor="code" error={state.errors?.code}>
                  <Input id="code" name="code" placeholder="P01" defaultValue={editing?.code ?? ""} />
                </Field>
              </div>
              <Field label="Description" htmlFor="description" error={state.errors?.description}>
                <Textarea id="description" name="description" rows={4} defaultValue={editing?.description ?? ""} />
              </Field>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Price" htmlFor="price" required error={state.errors?.price}>
                  <Input id="price" name="price" type="number" min="0" step="0.01" defaultValue={editing?.price ?? 0} />
                </Field>
                <Field label="Currency" htmlFor="currency" error={state.errors?.currency}>
                  <Input id="currency" name="currency" maxLength={3} defaultValue={editing?.currency ?? "USD"} />
                </Field>
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Duration" htmlFor="duration" error={state.errors?.duration}>
                  <Input id="duration" name="duration" placeholder="5 days · 20 hours" defaultValue={editing?.duration ?? ""} />
                </Field>
                <Field label="Instructor" htmlFor="instructor" error={state.errors?.instructor}>
                  <Input id="instructor" name="instructor" defaultValue={editing?.instructor ?? ""} />
                </Field>
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Category" htmlFor="categoryId" error={state.errors?.categoryId}>
                  <select
                    id="categoryId"
                    name="categoryId"
                    defaultValue={editing?.category_id ?? ""}
                    className="flex h-11 w-full rounded-lg border border-input bg-card px-4 text-sm"
                  >
                    <option value="">None</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Visibility" htmlFor="visibility" error={state.errors?.visibility}>
                  <select
                    id="visibility"
                    name="visibility"
                    defaultValue={editing?.visibility ?? "draft"}
                    className="flex h-11 w-full rounded-lg border border-input bg-card px-4 text-sm"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </Field>
              </div>
              <Field label="Thumbnail URL" htmlFor="thumbnailUrl" error={state.errors?.thumbnailUrl}>
                <Input id="thumbnailUrl" name="thumbnailUrl" placeholder="https://…" defaultValue={editing?.thumbnail_url ?? ""} />
              </Field>
              <SubmitButton className="w-full">{editing ? "Save changes" : "Create course"}</SubmitButton>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-lg border border-border bg-card">
        {courses.length === 0 ? (
          <p className="p-8 text-center text-sm text-muted-foreground">
            No courses yet. Create your first course.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-12" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {courses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell className="font-medium">{course.title}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {course.category?.name ?? "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(course.price, course.currency)}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={course.visibility} />
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onSelect={() => openEdit(course)}>
                          <Pencil className="h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        {course.visibility !== "published" ? (
                          <DropdownMenuItem
                            onSelect={() =>
                              startTransition(async () => {
                                await setCourseVisibility(course.id, "published");
                                toast.success("Course published.");
                              })
                            }
                          >
                            <Eye className="h-4 w-4" /> Publish
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem
                            onSelect={() =>
                              startTransition(async () => {
                                await setCourseVisibility(course.id, "draft");
                                toast.success("Course unpublished.");
                              })
                            }
                          >
                            <EyeOff className="h-4 w-4" /> Unpublish
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                          onSelect={() =>
                            startTransition(async () => {
                              await setCourseVisibility(course.id, "archived");
                              toast.success("Course archived.");
                            })
                          }
                        >
                          <Archive className="h-4 w-4" /> Archive
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive"
                          onSelect={(e) => {
                            e.preventDefault();
                            setDeleting(course);
                          }}
                        >
                          <Trash2 className="h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Two-step guard for course deletion */}
      <ConfirmDelete
        open={deleting !== null}
        onOpenChange={(o) => !o && setDeleting(null)}
        title="Delete this course?"
        itemLabel={deleting ? `${deleting.code ? deleting.code + " — " : ""}${deleting.title}` : undefined}
        description="The course will be removed from the website permanently. Existing orders keep their record. To take it offline instead, use Archive or Unpublish."
        pending={pending}
        onConfirm={() => {
          const c = deleting;
          if (!c) return;
          startTransition(async () => {
            await deleteCourse(c.id);
            toast.success("Course deleted.");
          });
        }}
      />
    </div>
  );
}

function CategoryManager({
  categories,
  pending,
  startTransition,
}: {
  categories: CourseCategory[];
  pending: boolean;
  startTransition: (callback: () => void) => void;
}) {
  const [state, action] = useActionState(createCategory, initialActionState);
  const ref = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.ok && state.message) {
      toast.success(state.message);
      ref.current?.reset();
    } else if (state.message && !state.ok) {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <div className="flex flex-wrap items-center gap-2">
      <form ref={ref} action={action} className="flex items-center gap-2">
        <Input name="name" placeholder="New category" className="h-9 w-40" />
        <SubmitButton size="sm" variant="outline">
          Add
        </SubmitButton>
      </form>
      <div className="flex flex-wrap gap-1.5">
        {categories.map((c) => (
          <ConfirmDelete
            key={c.id}
            title="Remove this category?"
            itemLabel={c.name}
            description="Courses in this category are kept, but they will no longer show a category."
            confirmLabel="Remove category"
            pending={pending}
            onConfirm={() =>
              startTransition(async () => {
                await deleteCategory(c.id);
                toast.success("Category removed.");
              })
            }
          >
            <button
              type="button"
              disabled={pending}
              className="group inline-flex items-center gap-1 rounded-full border border-border bg-card px-3 py-1 text-xs hover:border-destructive hover:text-destructive"
              title="Remove category"
            >
              {c.name}
              <Trash2 className="h-3 w-3 opacity-0 group-hover:opacity-100" />
            </button>
          </ConfirmDelete>
        ))}
      </div>
    </div>
  );
}
