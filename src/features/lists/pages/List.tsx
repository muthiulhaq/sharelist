import { useEffect, useState } from "react";
import { NewListButton } from "../../../components/NewListButton";
import Search from "../../../components/Search";
import { supabase } from "../../../lib/supabase";
import type { IListItem } from "../../../types";

import ListItem from "../components/ListItem";
import "./List.css";

type ListRow = {
  id: number;
  title: string;
  created_at: string;
};

const List = () => {
  const [lists, setLists] = useState<IListItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!supabase) {
      setError("Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env, then restart the dev server.");
      return;
    }

    let cancelled = false;

    supabase
      .from("lists")
      .select("id, title, created_at")
      .order("created_at", { ascending: false })
      .then(({ data, error: queryError }) => {
        if (cancelled) return;

        if (queryError) {
          setError(queryError.message);
          return;
        }

        const rows = (data ?? []) as ListRow[];
        setLists(
          rows.map((row) => ({
            id: row.id,
            title: row.title,
            createdAt: row.created_at,
          })),
        );
      });

    return () => {
      cancelled = true;
    };
  }, []);

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
          />
        ))}
      </main>
      <NewListButton></NewListButton>
    </>
  );
};

export default List;
