import { createClient } from "@/lib/supabase/server";
import { db } from "@db/client";
import { users } from "@db/schema";
import { safeErrorResponse } from "@/lib/apiError";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user: authUser },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !authUser) {
      return Response.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { name } = (await request.json()) as { name?: string };
    const displayName = name?.trim() || authUser.user_metadata?.name || "User";

    const now = new Date();
    const created = await db
      .insert(users)
      .values({
        authId: authUser.id,
        name: displayName,
        email: authUser.email!,
        role: "member",
        isEnabled: false,
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    return Response.json(created[0] ?? null);
  } catch (error) {
    return safeErrorResponse("Failed to create user", error, "POST /api/auth/register");
  }
}
