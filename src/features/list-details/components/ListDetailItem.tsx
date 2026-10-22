import "./ListDetailItem.css";

interface IListDetailsItemProps {
  id: number;
  title: string;
  quantity: number | null;
  unit: string;
  notes: string;
  onSelect: () => void;
  onDelete: () => void;
  readOnly?: boolean;
}

const ListDetailItem = ({title, quantity, unit, notes, onSelect, onDelete, readOnly = false}: IListDetailsItemProps) => {
  const showQuantity = quantity != null && quantity > 0;
  const showUnit = unit.trim().length > 0;

  return (
    <>
      <div className="list-item" onClick={readOnly ? undefined : onSelect}>
        <div className="item-left">
          <div className="item-title">{title}</div>

          {notes.trim() && (
            <div className="item-note">
              <svg viewBox="0 0 20 20" aria-hidden="true">
                <path
                  fill="currentColor"
                  fillRule="evenodd"
                  d="M10 1.7 1.1 17.5A1.1 1.1 0 0 0 2.1 19.2h15.8a1.1 1.1 0 0 0 1-1.7L10 1.7Zm0 5.1a.9.9 0 0 1 .9.9v4.1a.9.9 0 1 1-1.8 0V7.7a.9.9 0 0 1 .9-.9Zm0 8.6a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z"
                />
              </svg>
              <span>{notes}</span>
            </div>
          )}
        </div>

        <div className="item-right">
          {(showQuantity || showUnit) && (
            <div className="qty">
              {showQuantity && quantity}
              {showUnit && <span>{unit}</span>}
            </div>
          )}

          {!readOnly && (
          <div className="item-actions">
            <button
              type="button"
              title="Edit"
              onClick={(event) => {
                event.stopPropagation();
                onSelect();
              }}
            >
              <i className="fa-solid fa-pen"></i>
            </button>

            <button
              type="button"
              className="delete"
              title="Delete"
              onClick={(event) => {
                event.stopPropagation();
                onDelete();
              }}
            >
              <i className="fa-solid fa-trash"></i>
            </button>
          </div>
          )}
        </div>
      </div>

      <div className="divider"></div>
    </>
  );
};

export default ListDetailItem;
