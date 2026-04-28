import { requireAuth, type AuthResult } from "./apiAuth";

type AppRole = "admin" | "manager" | "member";

/**
 * Verifies Supabase session + checks that appUser.role is in the allowed roles.
 * Returns AuthResult or Response (401/403).
 */
export async function requireRole(
  ...allowedRoles: AppRole[]
): Promise<AuthResult | Response> {
  const auth = await requireAuth();
  if (auth instanceof Response) return auth;

  if (!allowedRoles.includes(auth.appUser.role as AppRole)) {
    return Response.json(
      { error: "Forbidden — insufficient role" },
      { status: 403 }
    );
  }

  return auth;
}
