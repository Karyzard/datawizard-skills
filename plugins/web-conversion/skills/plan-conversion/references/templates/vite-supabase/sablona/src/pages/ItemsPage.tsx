import { useState } from "react";
import {
  useItems,
  useCreateItem,
  useUpdateItem,
  useDeleteItem,
} from "@/hooks/useItems";
import { itemCreateSchema } from "@/lib/validation";

export function ItemsPage() {
  const { data: items, isLoading, error } = useItems();
  const createItem = useCreateItem();
  const updateItem = useUpdateItem();
  const deleteItem = useDeleteItem();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);

    const result = itemCreateSchema.safeParse({ title, description });
    if (!result.success) {
      setFormError(result.error.errors[0]?.message ?? "Invalid input");
      return;
    }

    try {
      await createItem.mutateAsync(result.data);
      setTitle("");
      setDescription("");
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Failed to create item");
    }
  }

  async function handleUpdate(id: string) {
    if (!editTitle.trim()) return;
    try {
      await updateItem.mutateAsync({ id, title: editTitle });
      setEditingId(null);
      setEditTitle("");
    } catch {
      // Error handled by TanStack Query
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this item?")) return;
    try {
      await deleteItem.mutateAsync(id);
    } catch {
      // Error handled by TanStack Query
    }
  }

  function startEdit(id: string, currentTitle: string) {
    setEditingId(id);
    setEditTitle(currentTitle);
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Items</h1>

      {/* Create form */}
      <form
        onSubmit={handleCreate}
        className="space-y-3 rounded-lg border border-border bg-surface p-4"
      >
        <h2 className="font-semibold text-foreground">Create new item</h2>

        {formError && (
          <div className="rounded-md bg-red-50 p-2 text-sm text-red-700">
            {formError}
          </div>
        )}

        <div>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>
        <div>
          <textarea
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>
        <button
          type="submit"
          disabled={createItem.isPending}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
        >
          {createItem.isPending ? "Creating..." : "Create item"}
        </button>
      </form>

      {/* Items list */}
      {isLoading && (
        <div className="text-sm text-muted-foreground">Loading items...</div>
      )}

      {error && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">
          Failed to load items: {error.message}
        </div>
      )}

      {items && items.length === 0 && (
        <div className="text-sm text-muted-foreground">
          No items yet. Create one above.
        </div>
      )}

      {items && items.length > 0 && (
        <div className="space-y-2">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between rounded-lg border border-border bg-surface p-4"
            >
              <div className="min-w-0 flex-1">
                {editingId === item.id ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleUpdate(item.id);
                        if (e.key === "Escape") setEditingId(null);
                      }}
                      className="flex-1 rounded-md border border-border bg-background px-2 py-1 text-sm outline-none focus:border-primary"
                      autoFocus
                    />
                    <button
                      onClick={() => handleUpdate(item.id)}
                      className="text-sm text-primary hover:underline"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="text-sm text-muted-foreground hover:underline"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <>
                    <h3 className="font-medium text-foreground">
                      {item.title}
                    </h3>
                    {item.description && (
                      <p className="mt-0.5 text-sm text-muted-foreground">
                        {item.description}
                      </p>
                    )}
                    <span className="mt-1 inline-block rounded bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                      {item.status}
                    </span>
                  </>
                )}
              </div>

              {editingId !== item.id && (
                <div className="ml-4 flex gap-2">
                  <button
                    onClick={() => startEdit(item.id, item.title)}
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    disabled={deleteItem.isPending}
                    className="text-sm text-red-600 hover:text-red-700"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
