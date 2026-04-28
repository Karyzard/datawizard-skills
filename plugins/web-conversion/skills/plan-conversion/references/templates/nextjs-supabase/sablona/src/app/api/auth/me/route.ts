import { createClient } from "@/lib/supabase/server";
import { db } from "@db/client";
import { users } from "@db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user: authUser },
    error,
  } = await supabase.auth.getUser();

  if (error || !authUser) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [appUser] = await db
    .select()
    .from(users)
    .where(eq(users.authId, authUser.id))
    .limit(1);

  if (!appUser) {
    return Response.json({ error: "No app user record" }, { status: 404 });
  }

  return Response.json({
    id: appUser.id,
    name: appUser.name,
    email: appUser.email,
    isEnabled: appUser.isEnabled,
    role: appUser.role,
  });
}
