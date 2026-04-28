import { createClient } from "@/lib/supabase/server";
import { db } from "@db/client";
import { users } from "@db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) {
    redirect("/login");
  }

  const [appUser] = await db
    .select()
    .from(users)
    .where(eq(users.authId, authUser.id))
    .limit(1);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <h1 className="text-xl font-semibold">{"{{APP_NAME}}"}</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              {appUser?.name ?? authUser.email}
            </span>
            <form action="/api/auth/logout" method="POST">
              <button
                type="submit"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        <h2 className="mb-4 text-2xl font-bold">
          Welcome, {appUser?.name ?? "User"}
        </h2>
        <p className="mb-6 text-muted-foreground">
          This is your dashboard. Start building your application from here.
        </p>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Link
            href="/items"
            className="rounded-lg border p-6 transition-colors hover:bg-muted"
          >
            <h3 className="mb-2 font-semibold">Items</h3>
            <p className="text-sm text-muted-foreground">
              Manage your items — create, view, and update.
            </p>
          </Link>
        </div>
      </main>
    </div>
  );
}
