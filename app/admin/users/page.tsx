import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getUsers } from "@/lib/queries";
import { formatDate, initials } from "@/lib/utils";

export default async function AdminUsersPage() {
  const users = await getUsers();

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Administrator accounts with access to this panel. Public visitors cannot register — new
        admins are provisioned in Supabase.
      </p>
      <div className="rounded-lg border border-border bg-card">
        {users.length === 0 ? (
          <p className="p-8 text-center text-sm text-muted-foreground">
            No users found. Run the seed SQL to create the initial admin.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Password status</TableHead>
                <TableHead className="text-right">Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((u) => (
                <TableRow key={u.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>{initials(u.full_name || u.email)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{u.full_name || "—"}</div>
                        <div className="text-xs text-muted-foreground">{u.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={u.role === "admin" ? "default" : "outline"}>{u.role}</Badge>
                  </TableCell>
                  <TableCell>
                    {u.must_change_password ? (
                      <Badge variant="warning">Change required</Badge>
                    ) : (
                      <Badge variant="success">Set</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right text-xs text-muted-foreground">
                    {formatDate(u.created_at)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
