import "./ListDetailItem.css";

interface IListDetailsItemProps {
  id: number;
  title: string;
  quantity: number;
  unit: string;
  notes: string;
  onSelect: () => void;
  onDelete: () => void;
  readOnly?: boolean;
}

const ListDetailItem = ({title, quantity, unit, notes, onSelect, onDelete, readOnly = false}: IListDetailsItemProps) => {
  return (
    <>
      <div className="list-item" onClick={readOnly ? undefined : onSelect}>
        <div className="item-left">
          <div className="item-title">{title}</div>

          {notes.trim() && (
            <div className="item-note">
              <i className="fa-solid fa-triangle-exclamation"></i>
              {notes}
            </div>
          )}
        </div>

        <div className="item-right">
          <div className="qty">
            {quantity}<span>{unit}</span>
          </div>

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
