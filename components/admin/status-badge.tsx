import { Badge } from "@/components/ui/badge";

const MAP: Record<string, { label: string; variant: "default" | "secondary" | "success" | "warning" | "destructive" | "outline" }> = {
  pending: { label: "Pending", variant: "warning" },
  submitted: { label: "Submitted", variant: "secondary" },
  approved: { label: "Approved", variant: "success" },
  rejected: { label: "Rejected", variant: "destructive" },
  new: { label: "New", variant: "default" },
  read: { label: "Read", variant: "secondary" },
  archived: { label: "Archived", variant: "outline" },
  draft: { label: "Draft", variant: "outline" },
  published: { label: "Published", variant: "success" },
};

export function StatusBadge({ status }: { status: string }) {
  const conf = MAP[status] ?? { label: status, variant: "outline" as const };
  return <Badge variant={conf.variant}>{conf.label}</Badge>;
}
