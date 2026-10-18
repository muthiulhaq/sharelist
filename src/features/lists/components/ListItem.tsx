import "./ListItem.css";
import { useNavigate } from "react-router-dom";

interface ListItemProps {
  id: number;
  title: string;
  createdAt: string;
  itemCount?: number;
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

const ListItem = ({ id, title, createdAt, itemCount = 0 }: ListItemProps) => {
  const navigate = useNavigate();

  return (
    <div className="card" onClick={() => navigate(`/list/${id}`)}>
      <div className="card-info">
        <div className="title-row">
          <h3>
            {title}
          </h3>

          {itemCount > 0 && <span className="badge">{itemCount}</span>}
        </div>

        <p>
          <i className="fa-regular fa-calendar"></i>
          {formatListDate(createdAt)}
        </p>
      </div>

      <div className="actions">
        <button>
          <i className="fas fa-share"></i>
        </button>

        <button className="delete">
          <i className="fas fa-trash"></i>
        </button>
      </div>
    </div>
  );
};

export default ListItem;
