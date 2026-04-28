import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";

const rawConnectionString = process.env.DATABASE_URL;

if (!rawConnectionString) {
  throw new Error("DATABASE_URL is not set");
}

let connectionString = rawConnectionString;

try {
  const url = new URL(rawConnectionString);
  if (url.hostname.includes("supabase_db_")) {
    url.hostname = url.hostname.split("_")[1];
    connectionString = url.toString();
  }
} catch {
  // If the URL fails to parse, let postgres handle the error.
}

// Disable prefetch because Supabase pooler uses transaction mode.
export const client = postgres(connectionString, {
  prepare: false,
  max: 10,
  idle_timeout: 30,
  connect_timeout: 10,
});

export const db = drizzle(client);
