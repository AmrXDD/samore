"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Download, FileUp, Upload } from "lucide-react";
import { importCsv } from "@/app/actions/data-transfer";
import { initialActionState } from "@/lib/action-state";
import type { Dataset } from "@/lib/data-transfer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SubmitButton } from "@/components/forms/form-primitives";

export function DataTransferManager({ datasets }: { datasets: Dataset[] }) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {datasets.map((d) => (
        <DatasetCard key={d.key} dataset={d} />
      ))}
    </div>
  );
}

function DatasetCard({ dataset }: { dataset: Dataset }) {
  const [state, action] = useActionState(importCsv, initialActionState);
  const [fileName, setFileName] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!state.message) return;
    if (state.ok) {
      toast.success(state.message);
      formRef.current?.reset();
      setFileName(null);
    } else {
      toast.error(state.message.split("\n")[0]);
    }
  }, [state]);

  const columns = dataset.columns.filter((c) => !c.readOnly);

  return (
    <div className="flex flex-col rounded-lg border border-border bg-card p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="font-semibold tracking-tight">{dataset.label}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{dataset.description}</p>
        </div>
        <Badge variant={dataset.importable ? "default" : "secondary"} className="shrink-0">
          {dataset.importable ? "Import + export" : "Export only"}
        </Badge>
      </div>

      {dataset.importable ? (
        <p className="mt-3 break-words text-xs text-muted-foreground">
          Columns:{" "}
          {columns.map((c, i) => (
            <span key={c.name}>
              <code className="rounded bg-secondary px-1 py-0.5">{c.name}</code>
              {c.required ? "*" : ""}
              {i < columns.length - 1 ? " " : ""}
            </span>
          ))}
        </p>
      ) : null}

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Button asChild variant="outline" size="sm">
          <a href={`/api/admin/export/${dataset.key}`} download>
            <Download /> Export CSV
          </a>
        </Button>

        {dataset.importable ? (
          <form ref={formRef} action={action} className="flex flex-wrap items-center gap-2">
            <input type="hidden" name="dataset" value={dataset.key} />
            <input
              ref={inputRef}
              type="file"
              name="file"
              accept=".csv,text/csv"
              className="hidden"
              onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => inputRef.current?.click()}
            >
              <FileUp /> {fileName ? "Change file" : "Choose CSV"}
            </Button>
            {fileName ? (
              <>
                <span className="max-w-[12rem] truncate text-xs text-muted-foreground">
                  {fileName}
                </span>
                <SubmitButton size="sm">
                  <Upload /> Import
                </SubmitButton>
              </>
            ) : null}
          </form>
        ) : null}
      </div>

      {state.message && !state.ok ? (
        <pre className="mt-4 max-h-48 overflow-auto whitespace-pre-wrap rounded-md border border-destructive/40 bg-destructive/5 p-3 text-xs text-destructive">
          {state.message}
        </pre>
      ) : null}
    </div>
  );
}
