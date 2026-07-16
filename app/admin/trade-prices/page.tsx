import { TradePriceManager } from "@/components/admin/trade-price-manager";
import { getSteelPrices, getOilPrices } from "@/lib/queries";

export default async function AdminTradePricesPage() {
  // Include hidden rows so the admin can see and re-enable them.
  const [steel, oil] = await Promise.all([getSteelPrices(false), getOilPrices(false)]);

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        The price tables shown on the public{" "}
        <span className="font-medium text-foreground">Steel Trading</span> and{" "}
        <span className="font-medium text-foreground">Oil Trading</span> pages. Add, edit, hide or
        delete rows — the website updates within a minute. Values are free text, so entries like{" "}
        <code className="rounded bg-secondary px-1 py-0.5 text-xs">1M</code>,{" "}
        <code className="rounded bg-secondary px-1 py-0.5 text-xs">300 K</code> and{" "}
        <code className="rounded bg-secondary px-1 py-0.5 text-xs">520/510</code> work exactly as
        written in the offer documents.
      </p>
      <TradePriceManager steel={steel} oil={oil} />
    </div>
  );
}
