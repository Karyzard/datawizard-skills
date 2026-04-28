import {
  pgTable,
  boolean,
  text,
  timestamp,
  uuid,
  check,
  unique,
  index,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import type { InferSelectModel, InferInsertModel } from "drizzle-orm";

// ─── users ──────────────────────────────────────────────────────────────────

export const users = pgTable("users", {
  id:        uuid("id").primaryKey().defaultRandom(),
  authId:    uuid("auth_id").unique(),
  email:     text("email").notNull(),
  name:      text("name").notNull(),
  role:      text("role").notNull().default("member"),
  isEnabled: boolean("is_enabled").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (t) => [
  unique("users_email_unique").on(t.email),
  check("users_role_check", sql`${t.role} IN ('admin', 'manager', 'member')`),
]);

// ─── items (example resource) ───────────────────────────────────────────────

export const items = pgTable("items", {
  id:          uuid("id").primaryKey().defaultRandom(),
  title:       text("title").notNull(),
  description: text("description"),
  status:      text("status").notNull().default("draft"),
  userId:      uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  createdAt:   timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt:   timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (t) => [
  check("items_status_check", sql`${t.status} IN ('draft', 'active', 'completed', 'archived')`),
  index("idx_items_user_id").on(t.userId),
  index("idx_items_status").on(t.status),
]);

// ─── Inferred types ─────────────────────────────────────────────────────────

export type User    = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;

export type Item    = InferSelectModel<typeof items>;
export type NewItem = InferInsertModel<typeof items>;
