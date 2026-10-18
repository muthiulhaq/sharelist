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

function SignedInApp() {
  const location = useLocation();
  const isDetail = location.pathname.startsWith("/list");

  return (
    <ListCountProvider>
      <Header></Header>
      <Routes>
        <Route path="/" element={<List />} />
        <Route path="/list" element={<ListDetails />} />
        <Route path="/list/:id" element={<ListDetails />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {!isDetail && <BottomNav></BottomNav>}
    </ListCountProvider>
  );
}

function App() {
  const { user, loading } = useAuth();

  return (
    <div className="mobile">
      {loading ? (
        <p className="auth-wait">Loading...</p>
      ) : user ? (
        <SignedInApp />
      ) : (
        <Routes>
          <Route path="/register" element={<AuthScreen />} />
          <Route path="*" element={<AuthScreen />} />
        </Routes>
      )}
    </div>
  );
}

export default App;
