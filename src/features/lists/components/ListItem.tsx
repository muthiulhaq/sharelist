import { useEffect, useState } from "react";
import "./ListItem.css";
import { useNavigate } from "react-router-dom";

interface ListItemProps {
  id: number;
  title: string;
  createdAt: string;
  itemCount?: number;
  onSave: (id: number, title: string) => void;
  onDelete: (id: number) => void;
}

function formatListDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}

const ListItem = ({
  id,
  title,
  createdAt,
  itemCount = 0,
  onSave,
  onDelete,
}: ListItemProps) => {
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(title);

  useEffect(() => {
    if (!editing) setDraft(title);
  }, [title, editing]);

  const save = () => {
    const nextTitle = draft.trim();
    if (!nextTitle) return;
    onSave(id, nextTitle);
    setEditing(false);
  };

  return (
    <div className="card" onClick={() => navigate(`/list/${id}`)}>
      <div className="card-info">
        <div className="title-row">
          <div className="title-main">
            {editing ? (
              <input
                className="title-input"
                value={draft}
                autoFocus
                onClick={(event) => event.stopPropagation()}
                onChange={(event) => setDraft(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") save();
                  if (event.key === "Escape") {
                    setDraft(title);
                    setEditing(false);
                  }
                }}
              />
            ) : (
              <h3>{title}</h3>
            )}

            {editing ? (
              <button
                type="button"
                className="title-action save"
                title="Save"
                onClick={(event) => {
                  event.stopPropagation();
                  save();
                }}
              >
                <i className="fa-solid fa-check"></i>
              </button>
            ) : (
              <button
                type="button"
                className="title-action"
                title="Edit"
                onClick={(event) => {
                  event.stopPropagation();
                  setEditing(true);
                }}
              >
                <i className="fa-solid fa-pen"></i>
              </button>
            )}
          </div>
        </div>

        <p className="card-meta">
          <span className="card-date">
            <i className="fa-regular fa-calendar"></i>
            {formatListDate(createdAt)}
          </span>
          {itemCount > 0 && (
            <span className="card-count">
              <i className="fa-solid fa-list-ul"></i>
              {itemCount} {itemCount === 1 ? "item" : "items"}
            </span>
          )}
        </p>
      </div>

      <div className="actions" onClick={(event) => event.stopPropagation()}>
        <button type="button">
          <i className="fas fa-share"></i>
        </button>

        <button
          type="button"
          className="delete"
          title="Delete"
          onClick={() => onDelete(id)}
        >
          <i className="fas fa-trash"></i>
        </button>
      </div>
    </div>
  );
};

export default ListItem;
