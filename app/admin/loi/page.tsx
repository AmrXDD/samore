import { LoiManager } from "@/components/admin/loi-manager";
import { getLois } from "@/lib/queries";

export default async function AdminLoiPage() {
  const lois = await getLois();
  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Every generated Letter of Intent. Search, preview, download or delete.
      </p>
      <LoiManager lois={lois} />
    </div>
  );
}
