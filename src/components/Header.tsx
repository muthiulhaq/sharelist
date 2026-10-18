import { useState } from "react";
import "./Header.css";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useListCount } from "../listCount";

const Header = () => {
  const { count, detail } = useListCount();
  const location = useLocation();
  const navigate = useNavigate();
  const isDetail = location.pathname.startsWith("/list");
  const [menuOpen, setMenuOpen] = useState(false);
  const itemCount = detail?.itemCount ?? 0;
  const subtitle = isDetail
    ? `${itemCount} ${itemCount === 1 ? "item" : "items"}`
    : `${count} ${count === 1 ? "List" : "Lists"}`;

  return (
    <header className="header">
      {isDetail && (
        <button
          type="button"
          className="icon-btn"
          title="Back"
          onClick={() => navigate("/")}
        >
          <i className="fas fa-arrow-left"></i>
        </button>
      )}
      <div className="header-copy">
        <h2>{isDetail ? detail?.title || "List" : "My Lists"}</h2>
        <span>{subtitle}</span>
      </div>

      {!isDetail && (
        <div className="header-menu-wrap">
          <button
            type="button"
            className="icon-btn"
            title="More"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <i className="fas fa-ellipsis-vertical"></i>
          </button>
          {menuOpen && (
            <>
              <button
                type="button"
                className="header-menu-backdrop"
                aria-label="Close menu"
                onClick={() => setMenuOpen(false)}
              />
              <div className="header-menu">
                <button type="button" onClick={() => setMenuOpen(false)}>
                  <i className="fa-regular fa-user"></i>
                  Profile
                </button>
                <button type="button" onClick={() => setMenuOpen(false)}>
                  <i className="fa-regular fa-comment"></i>
                  Feedback
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    setMenuOpen(false);
                    await supabase?.auth.signOut();
                  }}
                >
                  <i className="fa-solid fa-right-from-bracket"></i>
                  Logout
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
