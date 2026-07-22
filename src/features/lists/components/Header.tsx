import "./Header.css";

const Header = () => {
  return (
    <header className="header">
      <div>
        <h2>My Lists</h2>
        <span>26 Lists</span>
      </div>

      <button className="icon-btn">
        <i className="fas fa-ellipsis-vertical"></i>
      </button>
    </header>
  );
};

export default Header;
