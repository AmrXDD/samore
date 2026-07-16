import Link from "next/link";
import { ExternalLink } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { SERVICES } from "@/lib/services";
import { HIERARCHY } from "@/lib/constants";

export default function AdminServicesPage() {
  const rows = Object.values(SERVICES);

  return (
    <div className="space-y-8">
      <p className="text-sm text-muted-foreground">
        The SAMORE service hierarchy is a fixed 1:1 replica of the company chart and is the
        source of truth for navigation and routing. Content is managed in{" "}
        <code className="rounded bg-secondary px-1.5 py-0.5 text-xs">lib/services.ts</code>.
      </p>

      {/* Hierarchy overview */}
      <div className="grid gap-6 lg:grid-cols-2">
        {HIERARCHY.map((division) => (
          <div key={division.slug} className="rounded-lg border border-border bg-card p-6">
            <h2 className="font-semibold tracking-tight">{division.title}</h2>
            <ul className="mt-4 space-y-3">
              {division.children.map((cat) => (
                <li key={cat.slug}>
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    {cat.title}
                  </p>
                  <div className="mt-1 flex flex-wrap gap-1.5">
                    {cat.children.map((leaf) => (
                      <Link
                        key={leaf.slug}
                        href={`/${leaf.slug}`}
                        target="_blank"
                        className="rounded-full border border-border px-2.5 py-0.5 text-xs hover:border-ink"
                      >
                        {leaf.title}
                      </Link>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="rounded-lg border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Service</TableHead>
              <TableHead>Division</TableHead>
              <TableHead>Parent</TableHead>
              <TableHead>SEO title</TableHead>
              <TableHead className="w-12" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((s) => (
              <TableRow key={s.slug}>
                <TableCell className="font-medium">{s.title}</TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {s.division === "engineering-construction" ? "Engineering" : "Trading"}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{s.parentSlug ?? "—"}</TableCell>
                <TableCell className="max-w-[260px] truncate text-sm text-muted-foreground">
                  {s.seo.title}
                </TableCell>
                <TableCell>
                  <Link href={`/${s.slug}`} target="_blank" className="text-muted-foreground hover:text-foreground">
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
