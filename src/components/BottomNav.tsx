import "./BottomNav.css";
import { useNavigate } from "react-router-dom";

export const BottomNav = () => {
  const navigate = useNavigate();

  return (
    <nav className="bottom-nav">
      <button className="active" onClick={() => navigate(`/`)}>
        <i className="fas fa-list"></i>
        <span>Lists</span>
      </button>

      <button>
        <i className="fas fa-users"></i>
        <span>Shared</span>
      </button>

      <button >
        <i className="fas fa-user"></i>
        <span>Profile</span>
      </button>
    </nav>
  );
};

export default BottomNav;
