import "./ListItem.css";

interface ListItemProps {
  title: string;
  createdAt: string;
  itemCount: number;
}

const ListItem = ({ title, createdAt, itemCount }: ListItemProps) => {
  return (
          <div className="card">
            <div className="card-info">
              <h3>{title}</h3>

              <p>
                <i className="fa-regular fa-calendar"></i>
                {createdAt}
              </p>
            </div>

            <div className="actions">
              <button>
                <i className="fas fa-share"></i>
              </button>

              <button>
                <i className="fas fa-eye"></i>
              </button>

              <button className="delete">
                <i className="fas fa-trash"></i>
              </button>
            </div>
          </div>
  );
};

export default ListItem;