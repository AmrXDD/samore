import { EmailsManager } from "@/components/admin/emails-manager";
import { getContactMessages, getNewsletter } from "@/lib/queries";

export default async function AdminEmailsPage() {
  const [messages, subscribers] = await Promise.all([
    getContactMessages(),
    getNewsletter(),
  ]);
  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Every contact submission and newsletter subscriber is stored here. Search, view, delete
        and export to CSV.
      </p>
      <EmailsManager messages={messages} subscribers={subscribers} />
    </div>
  );
}
