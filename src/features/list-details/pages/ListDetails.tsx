import { useEffect, useState } from "react";
import AddNewItem from "../../../components/AddNewItem";
import { supabase } from "../../../lib/supabase";
import type { IListDetailsItem } from "../../../types";
import ListDetailItem from "../components/ListDetailItem";
import { useParams } from "react-router-dom";
import "./ListDetails.css";
import ItemEditModal from "../components/ItemEditModal";

type ListItemRow = {
  id: number;
  title: string;
  quantity: number | null;
  unit: string | null;
  notes: string | null;
};

function mapRow(row: ListItemRow): IListDetailsItem {
  return {
    id: row.id,
    title: row.title,
    quantity: row.quantity ?? 0,
    unit: row.unit ?? "",
    notes: row.notes ?? "",
  };
}

const ListDetails = () => {
  const { id } = useParams();
  const [listDetailItemsData, setListDetailItemsData] = useState<
    IListDetailsItem[]
  >([]);
  const [selectedItem, setSelectedItem] = useState<IListDetailsItem | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setListDetailItemsData([]);
      return;
    }

    if (!supabase) {
      setError(
        "Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env, then restart the dev server."
      );
      return;
    }

    let cancelled = false;

    supabase
      .from("list_items")
      .select("id, title, quantity, unit, notes")
      .eq("list_id", Number(id))
      .order("id", { ascending: false })
      .then(({ data, error: queryError }) => {
        if (cancelled) return;

        if (queryError) {
          setError(queryError.message);
          setListDetailItemsData([]);
          return;
        }

        setError(null);
        setListDetailItemsData((data ?? []).map((row) => mapRow(row as ListItemRow)));
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleSaveItem = async (item: IListDetailsItem) => {
    if (!supabase || !id) {
      setListDetailItemsData((prev) =>
        prev.map((row) => (row.id === item.id ? item : row))
      );
      setSelectedItem(null);
      return;
    }

    const { data, error: updateError } = await supabase
      .from("list_items")
      .update({
        title: item.title,
        quantity: item.quantity,
        unit: item.unit,
        notes: item.notes,
      })
      .eq("id", item.id)
      .select("id, title, quantity, unit, notes")
      .single();

    if (updateError) {
      setError(
        updateError.code === "PGRST116"
          ? "Could not save this item. Allow update on list_items for the anon role."
          : updateError.message
      );
      return;
    }

    if (!data) {
      setError("Could not save this item. Allow update on list_items for the anon role.");
      return;
    }

    const saved = mapRow(data as ListItemRow);
    setError(null);
    setListDetailItemsData((prev) =>
      prev.map((row) => (row.id === saved.id ? saved : row))
    );
    setSelectedItem(null);
  };

  const handleDeleteItem = async (itemId: number) => {
    if (!supabase || !id) {
      setListDetailItemsData((prev) => prev.filter((row) => row.id !== itemId));
      setSelectedItem(null);
      return;
    }

    const { data, error: deleteError } = await supabase
      .from("list_items")
      .delete()
      .eq("id", itemId)
      .select("id");

    if (deleteError) {
      setError(deleteError.message);
      return;
    }

    if (!data?.length) {
      setError("Could not delete this item. Allow delete on list_items for the anon role.");
      return;
    }

    setError(null);
    setListDetailItemsData((prev) => prev.filter((row) => row.id !== itemId));
    setSelectedItem((current) => (current?.id === itemId ? null : current));
  };

  const handleAddedItem = async (value: string) => {
    if (!supabase || !id) {
      setListDetailItemsData((prev) => [
        {
          id: Date.now(),
          title: value,
          quantity: 1,
          unit: "Nos",
          notes: "",
        },
        ...prev,
      ]);
      return;
    }

    const { data, error: insertError } = await supabase
      .from("list_items")
      .insert({
        list_id: Number(id),
        title: value,
        quantity: 1,
        unit: "Nos",
        notes: "",
      })
      .select("id, title, quantity, unit, notes")
      .single();

    if (insertError) {
      setError(insertError.message);
      return;
    }

    if (data) {
      setError(null);
      setListDetailItemsData((prev) => [mapRow(data as ListItemRow), ...prev]);
    }
  };

  return (
    <>
      {selectedItem && (
        <ItemEditModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onSave={handleSaveItem}
        ></ItemEditModal>
      )}
      <AddNewItem onSend={handleAddedItem}></AddNewItem>
      <main className="list-area">
        {error && <p className="list-items-error">{error}</p>}
        {listDetailItemsData.map((item) => (
          <ListDetailItem
            key={item.id}
            id={item.id}
            title={item.title}
            quantity={item.quantity}
            unit={item.unit}
            notes={item.notes}
            onSelect={() => setSelectedItem(item)}
            onDelete={() => handleDeleteItem(item.id)}
          ></ListDetailItem>
        ))}
      </main>
    </>
  );
};

export default ListDetails;
