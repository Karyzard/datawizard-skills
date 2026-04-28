import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Item } from "@db/schema";

// ─── Types ──────────────────────────────────────────────────────────────────

type ItemCreatePayload = {
  title: string;
  description?: string | null;
  status?: "draft" | "active" | "completed" | "archived";
};

// ─── Fetcher ────────────────────────────────────────────────────────────────

async function fetchItems(): Promise<Item[]> {
  const res = await fetch("/api/items");
  if (!res.ok) throw new Error("Failed to fetch items");
  return res.json();
}

async function createItem(data: ItemCreatePayload): Promise<Item> {
  const res = await fetch("/api/items", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body?.error ?? "Failed to create item");
  }
  return res.json();
}

// ─── Hooks ──────────────────────────────────────────────────────────────────

export function useItems() {
  return useQuery({
    queryKey: ["items"],
    queryFn: fetchItems,
  });
}

export function useCreateItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
    },
  });
}
