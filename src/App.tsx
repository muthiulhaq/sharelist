import { Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import List from "./features/lists/pages/List";
import Header from "./components/Header";
import BottomNav from "./components/BottomNav";
import ListDetails from "./features/list-details/pages/ListDetails";
import { ListCountProvider } from "./listCount";

function App() {
  const location = useLocation();
  const isDetail = location.pathname.startsWith("/list");

  return (
    <ListCountProvider>
      <div className="mobile">
        <Header></Header>
        <Routes>
          <Route path="/" element={<List />} />
          <Route path="/list" element={<ListDetails />} />
          <Route path="/list/:id" element={<ListDetails />} />
        </Routes>
        {!isDetail && <BottomNav></BottomNav>}
      </div>
    </ListCountProvider>
  );
}

export default App;
