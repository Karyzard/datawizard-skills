/**
 * Safe error response — logs the full error server-side, returns only a generic message to the client.
 * Recognizes PG codes 23505 (unique violation -> 409) and 23503 (FK violation -> 409).
 */
export function safeErrorResponse(
  userMessage: string,
  error: unknown,
  routeLabel: string
): Response {
  console.error(`${routeLabel} failed:`, error);

  // PostgreSQL unique_violation
  if (isPgError(error, "23505")) {
    return Response.json(
      { error: "Duplicate record — a record with this combination already exists." },
      { status: 409 }
    );
  }

  // PostgreSQL foreign_key_violation
  if (isPgError(error, "23503")) {
    return Response.json(
      { error: "Cannot perform action — referenced record does not exist or has dependent records." },
      { status: 409 }
    );
  }

  return Response.json({ error: userMessage }, { status: 500 });
}

function isPgError(error: unknown, code: string): boolean {
  return (
    error != null &&
    typeof error === "object" &&
    "code" in error &&
    (error as { code: string }).code === code
  );
}
