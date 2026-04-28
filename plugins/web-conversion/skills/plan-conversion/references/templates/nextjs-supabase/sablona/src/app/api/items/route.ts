import { requireAuth } from "@/lib/supabase/apiAuth";
import { parseBody } from "@/lib/validation/parseBody";
import { itemCreateSchema } from "@/lib/validation/schemas";
import { safeErrorResponse } from "@/lib/apiError";
import { db } from "@db/client";
import { items } from "@db/schema";
import { eq, desc } from "drizzle-orm";

/**
 * GET /api/items — List all items for the authenticated user
 */
export async function GET() {
  try {
    const auth = await requireAuth();
    if (auth instanceof Response) return auth;

    const result = await db
      .select()
      .from(items)
      .where(eq(items.userId, auth.appUser.id))
      .orderBy(desc(items.createdAt));

    return Response.json(result);
  } catch (error) {
    return safeErrorResponse("Failed to fetch items", error, "GET /api/items");
  }
}

/**
 * POST /api/items — Create a new item
 */
export async function POST(request: Request) {
  try {
    const auth = await requireAuth();
    if (auth instanceof Response) return auth;

    const body = await request.json();
    const parsed = parseBody(itemCreateSchema, body);
    if (parsed instanceof Response) return parsed;

    const now = new Date();
    const [created] = await db
      .insert(items)
      .values({
        ...parsed.data,
        userId: auth.appUser.id,
        status: parsed.data.status ?? "draft",
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    return Response.json(created, { status: 201 });
  } catch (error) {
    return safeErrorResponse("Failed to create item", error, "POST /api/items");
  }
}
