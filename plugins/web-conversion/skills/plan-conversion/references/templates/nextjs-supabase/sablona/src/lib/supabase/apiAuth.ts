import { createClient } from "./server";
import { db } from "@db/client";
import { users } from "@db/schema";
import { eq } from "drizzle-orm";
import type { User as AuthUser } from "@supabase/supabase-js";
import type { User as AppUser } from "@db/schema";

export interface AuthResult {
  authUser: AuthUser;
  appUser: AppUser;
}

/**
 * Verifies Supabase session and finds the corresponding record in the users table.
 * Returns AuthResult or Response (401/403).
 */
export async function requireAuth(): Promise<AuthResult | Response> {
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
    return Response.json(
      { error: "Forbidden - no app user record" },
      { status: 403 }
    );
  }

  if (!appUser.isEnabled) {
    return Response.json(
      { error: "Account pending approval", code: "PENDING_APPROVAL" },
      { status: 403 }
    );
  }

  return { authUser, appUser };
}
