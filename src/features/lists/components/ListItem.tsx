import "./ListItem.css";
import { useNavigate } from "react-router-dom";

interface ListItemProps {
  id: number;
  title: string;
  createdAt: string;
  itemCount: number;
}

const ListItem = ({ id, title, createdAt, itemCount }: ListItemProps) => {
  const navigate = useNavigate();

  return (
    <div className="card" onClick={() => navigate(`/list/${id}`)}>
      <div className="card-info">
        <div className="title-row">
          <h3>{title} - {id}</h3>

          <span className="badge">{itemCount} - Items</span>
        </div>

        <p>
          <i className="fa-regular fa-calendar"></i>
          {createdAt}
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
