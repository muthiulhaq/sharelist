import { useEffect, useState } from "react";
import ConfirmDialog from "../../../components/ConfirmDialog";
import Search from "../../../components/Search";
import { useAuth } from "../../../auth";
import { supabase } from "../../../lib/supabase";
import { useListCount } from "../../../listCount";
import type { IListItem } from "../../../types";

import ListItem from "../components/ListItem";
import "./List.css";

type ListRow = {
  id: number;
  share_id: string;
  title: string;
  created_at: string;
};

type ItemRef = {
  list_id: number;
};

type DateFilter = "all" | "today" | "week" | "month";

const DATE_FILTERS: { id: DateFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "today", label: "Today" },
  { id: "week", label: "This week" },
  { id: "month", label: "This month" },
];

function startOfDay(date: Date) {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
}

function startOfWeek(date: Date) {
  const next = startOfDay(date);
  const day = next.getDay();
  const mondayOffset = day === 0 ? 6 : day - 1;
  next.setDate(next.getDate() - mondayOffset);
  return next;
}

function startOfMonth(date: Date) {
  const next = startOfDay(date);
  next.setDate(1);
  return next;
}

function matchesDate(createdAt: string, filter: DateFilter) {
  if (filter === "all") return true;
  const created = new Date(createdAt);
  if (Number.isNaN(created.getTime())) return false;
  const now = new Date();
  if (filter === "today") return created >= startOfDay(now);
  if (filter === "week") return created >= startOfWeek(now);
  return created >= startOfMonth(now);
}

const List = () => {
  const [lists, setLists] = useState<IListItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<IListItem | null>(null);
  const [query, setQuery] = useState("");
  const [dateFilter, setDateFilter] = useState<DateFilter>("all");
  const { user } = useAuth();
  const { setCount } = useListCount();

  useEffect(() => {
    if (!supabase || !user) {
      setError("Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env, then restart the dev server.");
      return;
    }

    const client = supabase;
    let cancelled = false;

    client
      .from("lists")
      .select("id, share_id, title, created_at")
      .eq("created_by", user.id)
      .order("created_at", { ascending: false })
      .then(async (listsResult) => {
        if (cancelled) return;

        if (listsResult.error) {
          setError(listsResult.error.message);
          return;
        }

        const rows = (listsResult.data ?? []) as ListRow[];
        const ids = rows.map((row) => row.id);
        const counts = new Map<number, number>();

        if (ids.length > 0) {
          const itemsResult = await client
            .from("list_items")
            .select("list_id")
            .in("list_id", ids);

          if (cancelled) return;

          if (itemsResult.error) {
            setError(itemsResult.error.message);
          } else {
            setError(null);
            for (const row of (itemsResult.data ?? []) as ItemRef[]) {
              counts.set(row.list_id, (counts.get(row.list_id) ?? 0) + 1);
            }
          }
        } else {
          setError(null);
        }

        const nextLists = rows.map((row) => ({
          id: row.id,
          shareId: row.share_id,
          title: row.title,
          createdAt: row.created_at,
          itemCount: counts.get(row.id) ?? 0,
        }));
        setLists(nextLists);
        setCount(nextLists.length);
      });

    return () => {
      cancelled = true;
    };
  }, [setCount, user]);

  const handleSaveTitle = async (listId: number, title: string) => {
    if (!supabase) return;

    const { data, error: updateError } = await supabase
      .from("lists")
      .update({ title })
      .eq("id", listId)
      .eq("created_by", user?.id ?? "")
      .select("id, title")
      .single();

    if (updateError) {
      setError(
        updateError.code === "PGRST116"
          ? "Could not rename this list. Allow update on lists for the anon role."
          : updateError.message,
      );
      return;
    }

    if (!data) return;

    setError(null);
    setLists((prev) =>
      prev.map((list) => (list.id === listId ? { ...list, title: data.title } : list)),
    );
  };

  const handleDeleteList = async (listId: number) => {
    if (!supabase) return;

    const { error: itemsError } = await supabase
      .from("list_items")
      .delete()
      .eq("list_id", listId);

    if (itemsError) {
      setError(itemsError.message);
      return;
    }

    const { data, error: deleteError } = await supabase
      .from("lists")
      .delete()
      .eq("id", listId)
      .eq("created_by", user?.id ?? "")
      .select("id");

    if (deleteError) {
      setError(deleteError.message);
      return;
    }

    if (!data?.length) {
      setError("Could not delete this list. Allow delete on lists for the anon role.");
      return;
    }

    setError(null);
    setLists((prev) => {
      const next = prev.filter((list) => list.id !== listId);
      setCount(next.length);
      return next;
    });
  };

  const visibleLists = lists.filter(
    (item) =>
      item.title.toLowerCase().includes(query.trim().toLowerCase()) &&
      matchesDate(item.createdAt, dateFilter),
  );
  const dateLabel = DATE_FILTERS.find((filter) => filter.id === dateFilter)?.label ?? "All";
  const emptyMessage = query.trim()
    ? `No lists match “${query.trim()}”${dateFilter === "all" ? "" : ` for ${dateLabel.toLowerCase()}`}.`
    : dateFilter === "all"
      ? "No lists yet."
      : `No lists for ${dateLabel.toLowerCase()}.`;

  return (
    <>
      {pendingDelete && (
        <ConfirmDialog
          title="Delete this list?"
          message={`“${pendingDelete.title}” and its items will be removed.`}
          onCancel={() => setPendingDelete(null)}
          onConfirm={() => {
            const listId = pendingDelete.id;
            setPendingDelete(null);
            handleDeleteList(listId);
          }}
        ></ConfirmDialog>
      )}
      <Search value={query} onChange={setQuery}></Search>
      <div className="date-filters" role="tablist" aria-label="Filter by date">
        {DATE_FILTERS.map((filter) => (
          <button
            key={filter.id}
            type="button"
            role="tab"
            aria-selected={dateFilter === filter.id}
            className={dateFilter === filter.id ? "active" : undefined}
            onClick={() => setDateFilter(filter.id)}
          >
            {filter.label}
          </button>
        ))}
      </div>
      <main className="content">
        {error && <p className="lists-error">{error}</p>}
        {!error && visibleLists.length === 0 && (
          <p className="lists-empty">{emptyMessage}</p>
        )}
        {visibleLists.map((item) => (
          <ListItem
            key={item.id}
            id={item.id}
            shareId={item.shareId}
            title={item.title}
            createdAt={item.createdAt}
            itemCount={item.itemCount}
            onSave={handleSaveTitle}
            onDelete={(listId) => {
              const list = lists.find((item) => item.id === listId);
              if (list) setPendingDelete(list);
            }}
          />
        ))}
      </main>
    </>
  );
};

export default List;
