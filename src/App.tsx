import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import { useAuth } from "./auth";
import List from "./features/lists/pages/List";
import Header from "./components/Header";
import BottomNav from "./components/BottomNav";
import ListDetails from "./features/list-details/pages/ListDetails";
import AuthScreen from "./features/auth/pages/AuthScreen";
import "./features/auth/pages/AuthScreen.css";
import { ListCountProvider } from "./listCount";

function App() {
  const { user, loading } = useAuth();
  const location = useLocation();
  const isSharedList = /^\/list\/[^/]+$/.test(location.pathname);
  const isDetail = location.pathname.startsWith("/list");

  if (loading) {
    return (
      <div className="mobile">
        <p className="auth-wait">Loading...</p>
      </div>
    );
  }

  if (!user && !isSharedList) {
    return (
      <div className="mobile">
        <Routes>
          <Route path="/register" element={<AuthScreen />} />
          <Route path="*" element={<AuthScreen />} />
        </Routes>
      </div>
    );
  }

  return (
    <div className="mobile">
      <ListCountProvider>
        <Header></Header>
        <Routes>
          <Route path="/list/:shareId" element={<ListDetails />} />
          {user && <Route path="/" element={<List />} />}
          {user && <Route path="/list" element={<ListDetails />} />}
          <Route path="*" element={<Navigate to={user ? "/" : "/login"} replace />} />
        </Routes>
        {user && !isDetail && <BottomNav></BottomNav>}
      </ListCountProvider>
    </div>
  );
}

export default App;
