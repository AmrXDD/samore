import { DataTransferManager } from "@/components/admin/data-transfer-manager";
import { DATASETS } from "@/lib/data-transfer";

export default function AdminDataPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2 text-sm text-muted-foreground">
        <p>
          Download any table as a CSV (opens in Excel or Google Sheets), or upload a CSV to add and
          update rows in bulk.
        </p>
        <p>
          <span className="font-medium text-foreground">How importing works:</span> export first and
          edit that file. Rows with an <code className="rounded bg-secondary px-1 py-0.5 text-xs">id</code>{" "}
          update the existing record; rows with a blank id are created. Only columns in your file are
          changed, and nothing is ever deleted. The whole file is checked first — if any row has an
          error, nothing is imported. Columns marked * are required for new rows.
        </p>
      </div>
      <DataTransferManager datasets={DATASETS} />
    </div>
  );
}
