import { Route, Routes } from "react-router-dom";
import "./App.css";
import List from "./features/lists/pages/List";
import Header from "./components/Header";
import Search from "./components/Search";
import NewListButton from "./components/NewListButton";
import BottomNav from "./components/BottomNav";
import ListDetails from "./features/list-details/pages/ListDetails";


function App() {
  return (
    <div className="mobile">
      <Header></Header>
      <Search></Search>
    <Routes>
      <Route path="/" element={<List />} />
      <Route path="/list/:id" element={<ListDetails />} />
    </Routes>
      <NewListButton></NewListButton>
      <BottomNav></BottomNav>
    </div>
  );
}

export default App;
