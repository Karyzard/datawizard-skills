import { type ZodType, type ZodError } from "zod";

/**
 * Validates data against a Zod schema.
 * On failure, returns a 400 Response with the list of errors.
 * On success, returns the parsed data.
 */
export function parseBody<T>(
  schema: ZodType<T>,
  data: unknown
): { data: T } | Response {
  const result = schema.safeParse(data);

  if (!result.success) {
    const issues = (result.error as ZodError).issues.map((i) => ({
      path: i.path.join("."),
      message: i.message,
    }));

    return Response.json(
      { error: "Validation failed", issues },
      { status: 400 }
    );
  }

  return { data: result.data };
}
