import "./BottomNav.css";

export const BottomNav = () => {
  return (
    <nav className="bottom-nav">
      <button className="active">
        <i className="fas fa-list"></i>
        <span>Lists</span>
      </button>

      <button>
        <i className="fas fa-users"></i>
        <span>Shared</span>
      </button>

      <button>
        <i className="fas fa-user"></i>
        <span>Profile</span>
      </button>
    </nav>
  );
};

export default BottomNav;
