import { useEffect, useRef, useState } from "react";
import AddNewItem from "../../../components/AddNewItem";
import ConfirmDialog from "../../../components/ConfirmDialog";
import { useAuth } from "../../../auth";
import { supabase } from "../../../lib/supabase";
import { useListCount } from "../../../listCount";
import type { IListDetailsItem } from "../../../types";
import ListDetailItem from "../components/ListDetailItem";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import "./ListDetails.css";
import ItemEditModal from "../components/ItemEditModal";

type DraftLocationState = {
  draftTitle?: string;
};

type ListItemRow = {
  id: number;
  title: string;
  quantity: number | null;
  unit: string | null;
  notes: string | null;
};

function checkedStorageKey(shareId: string) {
  return `sharelist-checked:${shareId}`;
}

function readCheckedIds(shareId: string) {
  try {
    const parsed = JSON.parse(localStorage.getItem(checkedStorageKey(shareId)) ?? "[]");
    return Array.isArray(parsed)
      ? parsed.filter((id): id is number => typeof id === "number")
      : [];
  } catch {
    return [];
  }
}

function mapRow(row: ListItemRow): IListDetailsItem {
  return {
    id: row.id,
    title: row.title,
    quantity: row.quantity != null && row.quantity > 0 ? row.quantity : null,
    unit: row.unit?.trim() ?? "",
    notes: row.notes ?? "",
  };
}

type SharedList = {
  id: number;
  title: string;
  created_by: string | null;
  items: ListItemRow[] | null;
};

const ListDetails = () => {
  const { shareId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const draftTitle =
    (location.state as DraftLocationState | null)?.draftTitle?.trim() ?? "";
  const isDraft = !shareId && draftTitle.length > 0;
  const { user } = useAuth();
  const { setDetail, backAction } = useListCount();
  const saveListRef = useRef<() => void>(() => {});
  const [listTitle, setListTitle] = useState(draftTitle);
  const [listId, setListId] = useState<number | null>(null);
  const [ownerId, setOwnerId] = useState<string | null>(null);
  const readOnly = Boolean(shareId) && ownerId !== user?.id;
  const [listDetailItemsData, setListDetailItemsData] = useState<
    IListDetailsItem[]
  >([]);
  const [selectedItem, setSelectedItem] = useState<IListDetailsItem | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<IListDetailsItem | null>(null);
  const [checkedIds, setCheckedIds] = useState<number[]>([]);

  useEffect(() => {
    setCheckedIds(shareId ? readCheckedIds(shareId) : []);
  }, [shareId]);

  useEffect(() => {
    if (!shareId && !draftTitle && user) {
      navigate("/", { replace: true });
    }
  }, [shareId, draftTitle, navigate, user]);

  useEffect(() => {
    if (!shareId || !supabase) return;

    const client = supabase;
    let cancelled = false;

    client
      .rpc("get_list_by_share_id", { share: shareId })
      .then(({ data, error: listError }) => {
        if (cancelled) return;

        if (listError) {
          setError(listError.message);
          setListDetailItemsData([]);
          return;
        }

        const list = data as SharedList | null;
        if (!list?.title) {
          setListTitle("");
          setListId(null);
          setOwnerId(null);
          setListDetailItemsData([]);
          setError("This list is not available.");
          return;
        }

        setListTitle(list.title);
        setListId(list.id);
        setOwnerId(list.created_by);
        setError(null);
        setListDetailItemsData((list.items ?? []).map((row) => mapRow(row)));
      });

    return () => {
      cancelled = true;
    };
  }, [shareId]);

  useEffect(() => {
    const title = isDraft ? draftTitle : listTitle;
    if (!title) return;

    const remaining = readOnly
      ? listDetailItemsData.filter((item) => !checkedIds.includes(item.id)).length
      : undefined;

    setDetail({ title, itemCount: listDetailItemsData.length, remaining });

    return () => setDetail(null);
  }, [
    isDraft,
    draftTitle,
    listTitle,
    listDetailItemsData,
    checkedIds,
    readOnly,
    setDetail,
  ]);

  const toggleChecked = (itemId: number) => {
    if (!shareId) return;
    setCheckedIds((current) => {
      const next = current.includes(itemId)
        ? current.filter((id) => id !== itemId)
        : [...current, itemId];
      localStorage.setItem(checkedStorageKey(shareId), JSON.stringify(next));
      return next;
    });
  };

  const handleSaveItem = async (item: IListDetailsItem) => {
    if (readOnly) return;
    if (!supabase || isDraft) {
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
        unit: item.unit.trim() || null,
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
    if (readOnly) return;
    if (!supabase || isDraft) {
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

  const handleSaveList = async () => {
    if (!supabase || !isDraft || saving) return;

    setSaving(true);
    setError(null);

    const { data: list, error: listError } = await supabase
      .from("lists")
      .insert({
        title: draftTitle,
        share_id: crypto.randomUUID(),
        created_by: user?.id ?? null,
        created_by_email: user?.email ?? null,
      })
      .select("id")
      .single();

    if (listError || !list) {
      setError(
        listError?.message ??
          "Could not create this list. Allow insert on lists for the anon role."
      );
      setSaving(false);
      return;
    }

    if (listDetailItemsData.length > 0) {
      const { error: itemsError } = await supabase.from("list_items").insert(
        listDetailItemsData.map((item) => ({
          list_id: list.id,
          title: item.title,
          quantity: item.quantity,
          unit: item.unit.trim() || null,
          notes: item.notes,
        }))
      );

      if (itemsError) {
        await supabase.from("lists").delete().eq("id", list.id);
        setError(itemsError.message);
        setSaving(false);
        return;
      }
    }

    setSaving(false);
    navigate("/");
  };

  saveListRef.current = handleSaveList;

  useEffect(() => {
    backAction.current = isDraft ? () => saveListRef.current() : null;
    return () => {
      backAction.current = null;
    };
  }, [isDraft, backAction]);

  const handleAddedItem = async (value: string) => {
    if (readOnly) return;

    if (!supabase || isDraft || !listId) {
      setListDetailItemsData((prev) => [
        {
          id: Date.now(),
          title: value,
          quantity: null,
          unit: "",
          notes: "",
        },
        ...prev,
      ]);
      return;
    }

    const { data, error: insertError } = await supabase
      .from("list_items")
      .insert({
        list_id: listId,
        title: value,
        quantity: null,
        unit: null,
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
      {pendingDelete && (
        <ConfirmDialog
          title="Delete this item?"
          message={`“${pendingDelete.title}” will be removed from this list.`}
          onCancel={() => setPendingDelete(null)}
          onConfirm={() => {
            const itemId = pendingDelete.id;
            setPendingDelete(null);
            handleDeleteItem(itemId);
          }}
        ></ConfirmDialog>
      )}
      {selectedItem && (
        <ItemEditModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onSave={handleSaveItem}
        ></ItemEditModal>
      )}
      {!readOnly && <AddNewItem onSend={handleAddedItem}></AddNewItem>}
      <main className={isDraft ? "list-area list-area-draft" : readOnly ? "list-area list-area-readonly" : "list-area"}>
        {error && <p className="list-items-error">{error}</p>}
        {listDetailItemsData.length > 0 && (
          <div className="item-group">
            {listDetailItemsData.map((item) => (
              <ListDetailItem
                key={item.id}
                id={item.id}
                title={item.title}
                quantity={item.quantity}
                unit={item.unit}
                notes={item.notes}
                readOnly={readOnly}
                marked={readOnly && checkedIds.includes(item.id)}
                onToggle={readOnly ? () => toggleChecked(item.id) : undefined}
                onSelect={() => setSelectedItem(item)}
                onDelete={() => setPendingDelete(item)}
              ></ListDetailItem>
            ))}
          </div>
        )}
      </main>
      {isDraft && (
        <button
          type="button"
          className="save-list-btn"
          onClick={handleSaveList}
          disabled={saving}
        >
          <i className="fa-solid fa-check"></i>
          {saving ? "Saving..." : "Save"}
        </button>
      )}
    </>
  );
};

export default ListDetails;
