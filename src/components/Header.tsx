import "./Header.css";
import { useListCount } from "../listCount";

const Header = () => {
  const { count } = useListCount();
  const label = count === 1 ? "List" : "Lists";

  return (
    <header className="header">
      <div className="header-copy">
        <h2>My Lists</h2>
        <span>
          {count} {label}
        </span>
      </div>

      <button className="icon-btn">
        <i className="fas fa-ellipsis-vertical"></i>
      </button>
    </header>
  );
};

export default Header;
