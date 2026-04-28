import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Welcome back, {user?.email}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Link
          to="/items"
          className="rounded-lg border border-border bg-surface p-5 transition-colors hover:bg-muted"
        >
          <h2 className="font-semibold text-foreground">Items</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your items
          </p>
        </Link>
      </div>
    </div>
  );
}
