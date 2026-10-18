import { useEffect, useState } from "react";
import Search from "../../../components/Search";
import { supabase } from "../../../lib/supabase";
import { useListCount } from "../../../listCount";
import type { IListItem } from "../../../types";

import ListItem from "../components/ListItem";
import "./List.css";

type ListRow = {
  id: number;
  title: string;
  created_at: string;
};

type ItemRef = {
  list_id: number;
};

const List = () => {
  const [lists, setLists] = useState<IListItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { setCount } = useListCount();

  useEffect(() => {
    if (!supabase) {
      setError("Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env, then restart the dev server.");
      return;
    }

    let cancelled = false;

    Promise.all([
      supabase
        .from("lists")
        .select("id, title, created_at")
        .order("created_at", { ascending: false }),
      supabase.from("list_items").select("list_id"),
    ]).then(([listsResult, itemsResult]) => {
      if (cancelled) return;

      if (listsResult.error) {
        setError(listsResult.error.message);
        return;
      }

      if (itemsResult.error) {
        setError(itemsResult.error.message);
      } else {
        setError(null);
      }

      const counts = new Map<number, number>();
      for (const row of (itemsResult.data ?? []) as ItemRef[]) {
        counts.set(row.list_id, (counts.get(row.list_id) ?? 0) + 1);
      }

      const rows = (listsResult.data ?? []) as ListRow[];
      const nextLists = rows.map((row) => ({
        id: row.id,
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
  }, [setCount]);

  const handleSaveTitle = async (listId: number, title: string) => {
    if (!supabase) return;

    const { data, error: updateError } = await supabase
      .from("lists")
      .update({ title })
      .eq("id", listId)
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

  return (
    <>
      <Search></Search>
      <main className="content">
        {error && <p className="lists-error">{error}</p>}
        {lists.map((item) => (
          <ListItem
            key={item.id}
            id={item.id}
            title={item.title}
            createdAt={item.createdAt}
            itemCount={item.itemCount}
            onSave={handleSaveTitle}
            onDelete={handleDeleteList}
          />
        ))}
      </main>
    </>
  );
};

export default List;
