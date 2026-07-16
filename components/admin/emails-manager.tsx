"use client";

import { useMemo, useState, useTransition } from "react";
import { toast } from "sonner";
import { Download, Search, Trash2, Eye } from "lucide-react";
import { deleteContactMessage, updateContactStatus } from "@/app/actions/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/admin/status-badge";
import { formatDateTime, toCSV } from "@/lib/utils";
import type { ContactMessage, NewsletterSubscriber } from "@/types";

function download(filename: string, content: string) {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function EmailsManager({
  messages,
  subscribers,
}: {
  messages: ContactMessage[];
  subscribers: NewsletterSubscriber[];
}) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<ContactMessage | null>(null);
  const [pending, startTransition] = useTransition();

  const filteredMessages = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return messages;
    return messages.filter((m) =>
      [m.name, m.email, m.company, m.message, m.inquiry_type]
        .filter(Boolean)
        .some((v) => v!.toLowerCase().includes(q)),
    );
  }, [messages, query]);

  const filteredSubs = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return subscribers;
    return subscribers.filter((s) => s.email.toLowerCase().includes(q));
  }, [subscribers, query]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="relative w-full max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search emails…"
            className="pl-9"
          />
        </div>
      </div>

      <Tabs defaultValue="messages">
        <TabsList>
          <TabsTrigger value="messages">Contact messages ({filteredMessages.length})</TabsTrigger>
          <TabsTrigger value="subscribers">Newsletter ({filteredSubs.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="messages">
          <div className="mb-4 flex justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                download(
                  `contact-messages-${Date.now()}.csv`,
                  toCSV(
                    filteredMessages.map((m) => ({
                      name: m.name,
                      email: m.email,
                      company: m.company ?? "",
                      phone: m.phone ?? "",
                      inquiry_type: m.inquiry_type,
                      status: m.status,
                      message: m.message,
                      created_at: m.created_at,
                    })),
                  ),
                )
              }
            >
              <Download className="h-4 w-4" /> Export CSV
            </Button>
          </div>
          <div className="rounded-lg border border-border bg-card">
            {filteredMessages.length === 0 ? (
              <p className="p-8 text-center text-sm text-muted-foreground">No messages found.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Inquiry</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Received</TableHead>
                    <TableHead className="w-24" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMessages.map((m) => (
                    <TableRow key={m.id}>
                      <TableCell className="font-medium">{m.name}</TableCell>
                      <TableCell className="text-sm">{m.email}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{m.inquiry_type}</TableCell>
                      <TableCell><StatusBadge status={m.status} /></TableCell>
                      <TableCell className="text-right text-xs text-muted-foreground">
                        {formatDateTime(m.created_at)}
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setSelected(m);
                              if (m.status === "new") {
                                startTransition(() => updateContactStatus(m.id, "read"));
                              }
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            disabled={pending}
                            onClick={() =>
                              startTransition(async () => {
                                await deleteContactMessage(m.id);
                                toast.success("Message deleted.");
                              })
                            }
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </TabsContent>

        <TabsContent value="subscribers">
          <div className="mb-4 flex justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                download(
                  `newsletter-${Date.now()}.csv`,
                  toCSV(filteredSubs.map((s) => ({ email: s.email, created_at: s.created_at }))),
                )
              }
            >
              <Download className="h-4 w-4" /> Export CSV
            </Button>
          </div>
          <div className="rounded-lg border border-border bg-card">
            {filteredSubs.length === 0 ? (
              <p className="p-8 text-center text-sm text-muted-foreground">No subscribers found.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead className="text-right">Subscribed</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSubs.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell className="font-medium">{s.email}</TableCell>
                      <TableCell className="text-right text-xs text-muted-foreground">
                        {formatDateTime(s.created_at)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={selected !== null} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Message from {selected?.name}</DialogTitle>
          </DialogHeader>
          {selected ? (
            <div className="space-y-3 text-sm">
              <Row label="Email" value={selected.email} />
              {selected.company ? <Row label="Company" value={selected.company} /> : null}
              {selected.phone ? <Row label="Phone" value={selected.phone} /> : null}
              <Row label="Inquiry" value={selected.inquiry_type} />
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground">Message</p>
                <p className="mt-1 whitespace-pre-wrap leading-relaxed">{selected.message}</p>
              </div>
              <a
                href={`mailto:${selected.email}`}
                className="inline-block pt-2 text-sm underline underline-offset-4"
              >
                Reply by email →
              </a>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-0.5">{value}</p>
    </div>
  );
}
