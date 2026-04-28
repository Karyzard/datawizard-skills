import { z } from "zod";

// ─── Items (example resource) ───────────────────────────────────────────────

export const itemCreateSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(5000).nullable().optional(),
  status: z.enum(["draft", "active", "completed", "archived"]).optional(),
});

export const itemUpdateSchema = itemCreateSchema.partial();

// ─── Users ──────────────────────────────────────────────────────────────────

export const userCreateSchema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email().max(320),
  role: z.enum(["admin", "manager", "member"]).optional(),
});

export const userUpdateSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  email: z.string().email().max(320).optional(),
  role: z.enum(["admin", "manager", "member"]).optional(),
  isEnabled: z.boolean().optional(),
});
