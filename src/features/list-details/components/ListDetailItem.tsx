import "./ListDetailItem.css";

interface IListDetailsItemProps {
  id: number;
  title: string;
  quantity: number;
  unit: string;
  notes: string;
}

const ListDetailItem = ({id, title, quantity, unit, notes}: IListDetailsItemProps) => {
  return (
    <>
      <div className="list-item">
        <div className="item-left">
          <div className="item-title">{title}</div>

          <div className="item-note">
            <i className="fa-solid fa-triangle-exclamation"></i>
            {notes}
          </div>
        </div>

        <div className="item-right">
          <div className="qty">
            {quantity}<span>{unit}</span>
          </div>

          <div className="item-actions">
            <button title="Edit">
              <i className="fa-solid fa-pen"></i>
            </button>

            <button className="delete" title="Delete">
              <i className="fa-solid fa-trash"></i>
            </button>
          </div>
        </div>
      </div>

      <div className="divider"></div>
    </>
  );
};

export default ListDetailItem;
