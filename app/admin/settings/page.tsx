import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  CompanyForm,
  BankForm,
  HeroForm,
  SeoForm,
} from "@/components/admin/settings-forms";
import { getBankSettings, getHero, getCompanySetting } from "@/lib/queries";

export default async function AdminSettingsPage() {
  const [bank, hero, company] = await Promise.all([
    getBankSettings(),
    getHero(),
    getCompanySetting(),
  ]);

  const emailFrom = process.env.EMAIL_FROM || "Not configured";
  const emailTo = process.env.EMAIL_TO || "SAMORE2021@gmail.com";
  const resendConfigured = Boolean(process.env.RESEND_API_KEY);

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Manage company details, bank transfer information, the homepage hero and SEO.
      </p>

      <Tabs defaultValue="company">
        <TabsList className="flex-wrap">
          <TabsTrigger value="company">Company</TabsTrigger>
          <TabsTrigger value="bank">Bank Details</TabsTrigger>
          <TabsTrigger value="hero">Homepage Hero</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
        </TabsList>

        <TabsContent value="company">
          <div className="max-w-2xl rounded-lg border border-border bg-card p-6">
            <CompanyForm value={company} />
          </div>
        </TabsContent>

        <TabsContent value="bank">
          <div className="max-w-2xl rounded-lg border border-border bg-card p-6">
            <BankForm value={bank} />
          </div>
        </TabsContent>

        <TabsContent value="hero">
          <div className="max-w-2xl rounded-lg border border-border bg-card p-6">
            <HeroForm value={hero} />
          </div>
        </TabsContent>

        <TabsContent value="email">
          <div className="max-w-2xl space-y-4 rounded-lg border border-border bg-card p-6">
            <h3 className="font-medium">Email delivery (Resend)</h3>
            <p className="text-sm text-muted-foreground">
              Email settings are configured through environment variables for security.
            </p>
            <dl className="space-y-3 text-sm">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <dt className="text-muted-foreground">Status</dt>
                <dd className={resendConfigured ? "text-[hsl(var(--success))]" : "text-muted-foreground"}>
                  {resendConfigured ? "Connected" : "Not configured (emails are skipped)"}
                </dd>
              </div>
              <div className="flex items-center justify-between border-b border-border pb-3">
                <dt className="text-muted-foreground">From</dt>
                <dd className="font-medium">{emailFrom}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Internal inbox</dt>
                <dd className="font-medium">{emailTo}</dd>
              </div>
            </dl>
            <p className="text-xs text-muted-foreground">
              Set <code className="rounded bg-secondary px-1 py-0.5">RESEND_API_KEY</code>,{" "}
              <code className="rounded bg-secondary px-1 py-0.5">EMAIL_FROM</code> and{" "}
              <code className="rounded bg-secondary px-1 py-0.5">EMAIL_TO</code> to enable email.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="seo">
          <div className="max-w-2xl rounded-lg border border-border bg-card p-6">
            <SeoForm />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
