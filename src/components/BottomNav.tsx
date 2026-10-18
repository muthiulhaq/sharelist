import "./BottomNav.css";
import { useNavigate } from "react-router-dom";
import NewListButton from "./NewListButton";

export const BottomNav = () => {
  const navigate = useNavigate();

  return (
    <nav className="bottom-nav">
      <button className="active" onClick={() => navigate(`/`)}>
        <i className="fas fa-list"></i>
        <span>Lists</span>
      </button>

      <NewListButton></NewListButton>

      <button type="button">
        <i className="fa-regular fa-heart"></i>
        <span>Favorite</span>
      </button>
    </nav>
  );
};

export default BottomNav;
